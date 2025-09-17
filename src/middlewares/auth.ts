import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

import AppError from "../errors/AppError";
import { StatusCodes } from "http-status-codes";

import { CustomJwtPayload } from "../interface";

import catchAsync from "../shared/catchAsync";
import config from "../config";
import { User } from "../app/modules/auth/auth.model";
import { TUserRole } from "../app/modules/auth/auth.interface";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    //if the token is sent to the client side
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Your are not Authorized!");
    }

    //new add token verify
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as CustomJwtPayload;
    } catch (error) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }

    const { userEmail, role, iat, exp } = decoded;
    const user = await User.isUserExistsByEmail(userEmail);

    //checking user is exists
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "Token is invalid!");
    }

    if (requiredRoles && !requiredRoles.includes(role as TUserRole)) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,

        `You must be an ${requiredRoles.join(" or ")} to perform this action.`
      );
    }
    req.user = decoded;

    next();
  });
};

export default auth;
