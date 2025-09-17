import { Types } from "mongoose";

export type TDecoded = {
  data: {
    userEmail: string;
    role: string;
  };
  iat: number;
  exp: number;
};

export type IUserInfo = {
  userEmail: string;
  role: 'tutor' | 'student' | 'admin';
  iat: number;
  exp: number;
};


export type TUser = {
  _id?: string;
  firstName?:string;
  lastName?:string;
  name: string;
  email: string;
  phone:string;
  country:string;
  drivingLicense?:string;
  role: 'Admin' | 'Administrator' | 'User';
  password: string;
  introduction?:string;
  purchesCredits?:number
  remainingCredits?:number
  address?:string;
  profileImage?:string;
  createdAt: string;
  updatedAt: string;
}




export interface TJetSky {
  _id: Types.ObjectId | string;
  name: string;
  model: string;
  hp: number;
  price: number;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface TAdventurePack {
  _id: Types.ObjectId | string;
  jet_skyId: TJetSky;
  title: string;
  discountPercentage: number;
  ridesPricing3: number;
  ridesPricing5: number;
  ridesPricing8: number;
  refundAmount: number;
  feature_list: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}


export interface IPurchaseAdventurePackPayload {
  userId: string;              
  adventurePackId: string; 
  ridesNumber: number;          
  drivingLicense?: string;      
  price?: number;              
  refundableDeposit?: number;              
}


// export interface IBookingAdventurePack {
//       userId: Types.ObjectId;            
//       adventurePackId?: Types.ObjectId; 
//       purchasedCredits: number;
//       remainingCredits: number;
//       startDate: Date;      
//       expiryDate: Date;      
//       paymentStatus: "paid" | "unpaid";
//       price:number;
//       status: "active" | "expired" | "cancelled";
      
// }