import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { hash, compare } from 'bcryptjs';

import { prisma } from '../lib';
import { validateAgentDetails, validateUser } from '../validators';
import { LoginResponse, User } from '../entities';
import { getAccessToken } from '../utils';
import { isAuth } from '../middlewares/isAuth';
import { TContext } from '../types';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi';
  }

  //get all users
  @Query(() => [User])
  @UseMiddleware(isAuth)
  async users() {
    return await prisma.user.findMany();
  }

  //login user
  @Mutation(() => LoginResponse)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) throw new Error('Invalid email or password');

    const isPassword = await compare(password, user.password);
    if (!isPassword) throw new Error('Invalid email or password');

    return {
      accessToken: getAccessToken(user),
    };
  }

  // register user
  @Mutation(() => Boolean)
  async register(@Arg('email') email: string, @Arg('password') password: string) {
    const { error } = validateUser({ email, password });

    if (error) {
      throw new Error(error.details[0].message);
    }

    //check if user with email exist
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (user) throw new Error('email address already exists');

    const hashedPass = await hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        password: hashedPass,
      },
    });

    return true;
  }

  // get all users that are agents
  @Query(() => [User])
  @UseMiddleware(isAuth)
  async agents() {
    return prisma.user.findMany({ where: { isLandlord: true } });
  }

  //become an agent
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async makeAgent(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('phoneNumber') phoneNumber: string,
    @Ctx() { user }: TContext,
  ) {
    if (user.isLandlord) throw new Error('You are already an agent');

    const { error } = validateAgentDetails({ firstName, lastName, phoneNumber });
    if (error) {
      throw new Error(error.details[0].message);
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName,
        lastName,
        phoneNumber,
        isLandlord: true,
      },
    });

    return true;
  }

  //update agent details (name and Phone Number)
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateAgentProfile(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('phoneNumber') phoneNumber: string,
    @Ctx() { user }: TContext,
  ) {
    if (!user.isLandlord) throw new Error('Not allowed. Not yet an agent');

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        phoneNumber: phoneNumber || user.phoneNumber,
      },
    });

    return true;
  }
}
