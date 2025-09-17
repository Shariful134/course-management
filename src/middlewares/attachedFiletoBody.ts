import { NextFunction, Request, Response } from "express";
import { uploadToDigitalOceanAWS } from "../app/modules/upload/image.upload";

const attachFileToBody = async (req: Request, res: Response, next: NextFunction) => {
  try {
     // Upload the file to DigitalOcean Spaces
  // const fileUrl = await uploadToDigitalOceanAWS(req.file); // Use `await` here
 
  // For single file
  if (req.file) {
    const fileUrl = await uploadToDigitalOceanAWS(req.file);
    req.body.images = [fileUrl]; // store in array for consistency
  }
 
  // For multiple files
  if (req.files) {
    // req.files can be an object or array depending on multer setup
    const files = req.files as Express.Multer.File[];
 
    const uploadPromises = files.map(async file => {
 
      return (await uploadToDigitalOceanAWS(file)).Location; // return Promise
    });

 
    req.body.images = await Promise.all(uploadPromises);
  }
 
    next();
  } catch (error) {
    next(error);
  }
};

export default attachFileToBody;
