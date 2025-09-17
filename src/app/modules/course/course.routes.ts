import { Router } from "express";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/ValidateRequest";
import { courseValidation } from "./course.validation";
import { courseControllers } from "./course.controllers";

const router = Router();

router.post(
  "/",
  auth("admin"),
  validateRequest(courseValidation.createCourseSchema),
  courseControllers.createCourse
);
router.put(
  "/:id",
  auth("admin"),
  validateRequest(courseValidation.updateCourseSchema),
  courseControllers.updateCourse
);
router.delete("/:id", auth("admin"), courseControllers.deleteCourse);
router.get("/", courseControllers.getAllCourses);
router.get("/popular", courseControllers.getPopularCourses);
router.get("/:id", courseControllers.getSingleCourse);

export const courseRoutes = router;
