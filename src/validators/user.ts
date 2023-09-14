import Joi from 'joi';
import { RegisterDetails } from '../types';

export const validateUser = (userDetails: RegisterDetails) => {
  return Joi.object({
    password: Joi.string().trim().min(4).required(),
    email: Joi.string().trim().email().normalize(),
  }).validate(userDetails);
};
