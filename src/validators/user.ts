import Joi from 'joi';
import { AgentDetails, RegisterDetails } from '../types';

export const validateUser = (userDetails: RegisterDetails) => {
  return Joi.object({
    password: Joi.string().trim().min(4).required(),
    email: Joi.string().trim().email().normalize(),
  }).validate(userDetails);
};

export const validateAgentDetails = (agentDetails: AgentDetails) => {
  return Joi.object({
    firstName: Joi.string().trim().min(3).required(),
    lastName: Joi.string().trim().min(3).required(),
    phoneNumber: Joi.string().trim().min(10).required(),
  }).validate(agentDetails);
};
