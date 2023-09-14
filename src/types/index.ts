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
