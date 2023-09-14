import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number | undefined;

  @Field()
  email: string | undefined;
}
