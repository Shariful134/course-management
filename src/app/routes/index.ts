import express from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { courseRoutes } from "../modules/course/course.routes";
import { successStoryRoutes } from "../modules/success.story/succes.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/courses",
    route: courseRoutes,
  },
  {
    path: "/success-stories",
    route: successStoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
