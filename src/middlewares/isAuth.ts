import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IRequest, JWTTOKEN } from '../types';
import { prisma } from '../lib';

export const isAuth = async (req: IRequest, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) throw new Error('Not authorized');

  if (!authorization.includes('Bearer')) throw new Error('Invalid token format');

  const token = authorization.replace('Bearer ', '');

  try {
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET!) as JWTTOKEN;

    const user = await prisma.user.findUnique({ where: { id: decodeToken?.id } });

    if (!user) throw new Error('Unauthorized Access');

    req.user = user;

    next();
  } catch (error) {
    throw new Error('Error authenticating user');
  }
};
