import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookiePerser from "cookie-parser";
import bodyParser from "body-parser";
import router from "./app/routes";
import globalErrorHandler from "./middlewares/globalErrorhandler";
import notFound from "./middlewares/notFound";
import path from "path";
import auth from "./middlewares/auth";

const app: Application = express();

export const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:3001",
    "https://jared4444444-client-one.vercel.app",
    "https://course-management-frontend-bkvi3tb0h.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
  credentials: true,
};

//middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiePerser());

// File routes
// app.use('/api/files', fileRoutes);

// Setup API routes
app.use("/api/v1", router);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req: Request, res: Response) => {
  res.send("Jet Sky Server Hello!");
});

app.get("/cancel", (req, res) => {
  res.redirect("/");
});

// Error Handler
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
