import express from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { courseRoutes } from "../modules/course/course.routes";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
