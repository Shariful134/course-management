import { Router } from "express";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/ValidateRequest";
import { successStoryValidation } from "./succes.validtion";
import { successStoryControllers } from "./success.controllers";

const router = Router();

// Admin Only: Add Story
router.post(
  "/",
  auth("admin"),
  validateRequest(successStoryValidation.createStorySchema),
  successStoryControllers.createStory
);

// Public: Get All Stories
router.get("/", successStoryControllers.getAllStories);

export const successStoryRoutes = router;
