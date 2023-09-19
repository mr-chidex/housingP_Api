import { Query, Resolver, UseMiddleware } from 'type-graphql';

import { prisma } from '../lib';
import { Property } from '../entities';
import { isAuth } from '../middlewares/isAuth';

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
}
