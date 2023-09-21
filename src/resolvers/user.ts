import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';

import { prisma } from '../lib';
import { validateAgentDetails } from '../validators';
import { User } from '../entities';
import { isAuth } from '../middlewares/isAuth';
import { TContext } from '../types';

@Resolver()
export class UserResolver {
  //get all users
  @Query(() => [User])
  @UseMiddleware(isAuth)
  async users() {
    return await prisma.user.findMany();
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
