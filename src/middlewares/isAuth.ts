import jwt from 'jsonwebtoken';
import { Middleware, MiddlewareFn } from 'type-graphql/dist/interfaces/Middleware';

import { JWTTOKEN, TContext } from '../types';
import { prisma } from '../lib';

export const isAuth: Middleware<TContext> = async ({ context }, next) => {
  const { authorization } = context.req.headers;

  if (!authorization) throw new Error('Not authorized');

  if (!authorization.includes('Bearer')) throw new Error('Invalid token format');

  const token = authorization.replace('Bearer ', '');

  try {
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET!) as JWTTOKEN;

    const user = await prisma.user.findUnique({ where: { id: decodeToken?.id } });

    if (!user) throw new Error('Unauthorized Access');

    context.user = user;

    await next();
  } catch (error) {
    if (context.user) {
      throw new Error(error as string);
    }

    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`Error authenticating user. Please check token, ${error}`);
    }

    throw new Error(`Error authenticating user. Please check token`);
  }
};

export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
  const start = Date.now();
  await next();
  const resolveTime = Date.now() - start;
  console.log(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
};
