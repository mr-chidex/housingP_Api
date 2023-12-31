import { Arg, Mutation, Resolver } from 'type-graphql';
import { hash, compare } from 'bcryptjs';

import { prisma } from '../lib';
import { validateUser } from '../validators';
import { LoginResponse } from '../entities';
import { getAccessToken } from '../utils';

@Resolver()
export class AuthResolver {
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
}
