import { sign } from 'jsonwebtoken';
import { User } from '../types';

export const getAccessToken = (user: User) => {
  return sign({ email: user.email, id: user.id, iss: 'mr-chidex' }, process.env.TOKEN_SECRET!, {
    expiresIn: '20m',
  });
};
