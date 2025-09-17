import express from "express";

import { authValidation } from "./auth.validation";

import { authControllers } from "./auth.controllers";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/ValidateRequest";
import attachFileToBody from "../../../middlewares/attachedFiletoBody";
import { upload } from "../../../utils/upload";

const router = express.Router();

// User register
router.post(
  "/register-user",
  validateRequest(authValidation.userRegisterSchema),
  authControllers.registerUser
);

// User login
router.post(
  "/login",
  validateRequest(authValidation.loginValidationschema),
  authControllers.loginUser
);

// Logout Route
router.post("/logout", authControllers.logoutUser);

// getAll User
router.get("/get", authControllers.getAllUser);

// getSingle User
router.get("/get/:id", authControllers.getSingleUser);

// getAll User with administrator and without admin
router.get("/getAll/user/total", authControllers.getTotalCountUser);

// delete User
router.delete("/delete/user/:id", auth("admin"), authControllers.deleteUser);

export const AuthRoutes = router;
