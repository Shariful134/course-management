import { Types } from "mongoose";

export interface ICourse {
  title: string;
  description: string;
  price: number;
  instructor: Types.ObjectId | string;
  thumbnailImage: string;
  isPopular?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
