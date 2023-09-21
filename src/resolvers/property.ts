import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';

import { prisma } from '../lib';
import { Property } from '../entities';
import { isAuth } from '../middlewares/isAuth';
import { validateProperty } from '../validators';
import { TContext } from '../types';

@Resolver()
export class PropertyResolver {
  @Query(() => String)
  hello() {
    return 'hi';
  }

  @Query(() => [Property])
  @UseMiddleware(isAuth)
  async properties() {
    return await prisma.property.findMany();
  }

  @Mutation(() => Property)
  @UseMiddleware(isAuth)
  async addProperty(
    @Arg('name') name: string,
    @Arg('location') location: string,
    @Arg('description') description: string,
    @Ctx() { user }: TContext,
  ) {
    const { error } = validateProperty({ name, location, description });
    if (error) {
      throw new Error(error.details[0].message);
    }

    const property = await prisma.property.create({
      data: {
        name,
        location,
        description,
        owrnerId: user.id,
      },
    });

    return property;
  }
}
