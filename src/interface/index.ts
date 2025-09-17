import { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../app/modules/auth/auth.interface';


export interface CustomJwtPayload extends JwtPayload {
  id: string;
  userEmail: string;
  role: TUserRole;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user: CustomJwtPayload;
    }
  }
}
