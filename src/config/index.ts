import dotenv from "dotenv";
import path from "path";
// import Stripe from "stripe";

dotenv.config({ path: path.join(process.cwd(), ".env") });
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,

  base_rul: process.env.BASE_URL,

  // //CLOUDINARY
  // cloud_name: process.env.CLOUD_NAME,
  // api_key: process.env.CLOUD_API_KEY,
  // api_secret: process.env.CLOUD_API_SECRET,

  // //stripe
  // stripe_secrete_key: process.env.STRIPE_SECRET_KEY,

  // smtp_user: process.env.SMTP_USER,
  // smtp_pass: process.env.SMTP_PASS,
  // smtp_host: process.env.SMTP_HOST,
  // smtp_port: process.env.SMTP_PORT,

  // planId_24:process.env.PLANID_24,
  // planId_12:process.env.PLANID_12,
  // planId_6:process.env.PLANID_6,
};
