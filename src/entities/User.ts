import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field()
  createdAt: string;

  @Field()
  isLandlord: boolean;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
}
