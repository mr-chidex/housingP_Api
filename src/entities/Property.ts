import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Property {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field()
  description: string;

  @Field()
  owrnerId: string;

  @Field()
  createdAt: string;
}
