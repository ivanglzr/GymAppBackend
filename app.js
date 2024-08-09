import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "node:path";

import { authenticateUser } from "./middlewares/authenticateUser.js";
import { authenticateTrainingId } from "./middlewares/authenticateTrainingId.js";
import { authenticateExerciseId } from "./middlewares/authenticateExerciseId.js";

import {
  loginUser,
  logoutUser,
  getUser,
  postUser,
  putUser,
  deleteUser,
} from "./controllers/user.controller.js";

import {
  deleteTraining,
  getTraining,
  postTraining,
  putTraining,
} from "./controllers/training.controller.js";

import {
  getUserExercises,
  postExercise,
  deleteExercise,
  putExercise,
  getUserExerciseById,
  uploadImage,
} from "./controllers/exercise.controller.js";

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
});

app.disable("x-powered-by");
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/user/", authenticateUser);
app.use("/user/training/:trainingId", authenticateTrainingId);

app.get("/user", getUser);
app.get("/user/training/:trainingId", getTraining);

app.post("/login", loginUser);
app.post("/logout", logoutUser);
app.post("/user", postUser);
app.post("/user/training", postTraining);

app.put("/user", putUser);
app.put("/user/training/:trainingId", putTraining);

app.delete("/user", deleteUser);
app.delete("/user/training/:trainingId", deleteTraining);

// Exercises
app.use("/exercise", authenticateUser);
app.use("/exercise/:exerciseId", authenticateExerciseId);

app.get("/exercise", getUserExercises);
app.get("/exercise/:exerciseId", getUserExerciseById);

app.post("/exercise", postExercise);

app.put("/exercise/:exerciseId", putExercise);
app.put("/exercise/:exerciseId/image", upload.single("file0"), uploadImage);

app.delete("/exercise/:exerciseId", deleteExercise);

export default app;
