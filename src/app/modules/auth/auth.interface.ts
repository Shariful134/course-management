import { USER_ROLE } from "./auth.constant";

// User Interface
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "student" | "instructor";
  createdAt?: Date;
  updatedAt?: Date;
}

export type TUserLogin = {
  email: string;
  password: string;
};

export type TUserRole = keyof typeof USER_ROLE;
