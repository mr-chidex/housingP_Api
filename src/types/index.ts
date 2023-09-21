import { Request } from 'express';

export interface RegisterDetails {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  isLandlord: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRequest extends Request {
  user?: User;
}

export interface JWTTOKEN {
  email: string;
  id: string;
  iss: string;
}

export interface Property {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  location: string;
  description: string;
  owernerId: string;
  owrner: User;
}

export interface TContext {
  req: Request;
  res: Response;
  user: User;
}

export interface PropertyDetails {
  name: string;
  location: string;
  description: string;
}

export interface AgentDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
