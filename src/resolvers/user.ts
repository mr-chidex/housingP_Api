import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { hash, compare } from 'bcryptjs';

import { prisma } from '../lib';
import { validateUser } from '../validators';
import { LoginResponse, Property, User } from '../entities';
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

  //get user properties
  @Query(() => [Property])
  @UseMiddleware(isAuth)
  async userProperties(@Ctx() { user }: TContext) {
    const properties = await prisma.property.findMany({
      where: {
        owrnerId: user.id,
      },
    });

    return properties;
  }
}
