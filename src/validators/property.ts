import Joi from 'joi';
import { PropertyDetails } from '../types';

export const validateProperty = (propertyDetails: PropertyDetails) => {
  return Joi.object({
    name: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
  }).validate(propertyDetails);
};
