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
  getTraining,
  getTrainings,
  postTraining,
  putTraining,
  deleteTraining,
} from "./controllers/training.controller.js";

import {
  getImage,
  getUserExercises,
  postExercise,
  deleteExercise,
  putExercise,
  getUserExerciseById,
  uploadImage,
  getUserExercisesBySearch,
} from "./controllers/exercise.controller.js";

import { blockIPs } from "./middlewares/blockIp.js";
import { checkSearchParam } from "./middlewares/checkSearchParam.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());

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
  limits: { fileSize: 1024 * 1024 * 5 },
});

app.post("/login", loginUser);
app.post("/logout", logoutUser);

app.use(blockIPs);

app.post("/user", postUser);

app.use("/user/", authenticateUser);
app.use("/user/training/:trainingId", authenticateTrainingId);

app.get("/user", getUser);
app.get("/user/training/:trainingId", getTraining);
app.get("/user/training", getTrainings);

app.post("/user/training", postTraining);

app.put("/user", putUser);
app.put("/user/training/:trainingId", putTraining);

app.delete("/user", deleteUser);
app.delete("/user/training/:trainingId", deleteTraining);

// Exercises
app.use("/exercise", authenticateUser);

app.get("/exercise", getUserExercises);
app.get("/exercise/image/:image", getImage);

app.get("/exercise/search/", checkSearchParam, getUserExercisesBySearch);

app.use("/exercise/:exerciseId", authenticateExerciseId);

app.get("/exercise/:exerciseId", getUserExerciseById);

app.post("/exercise", postExercise);

app.put("/exercise/:exerciseId", putExercise);
app.put("/exercise/:exerciseId/image", upload.single("file0"), uploadImage);

app.delete("/exercise/:exerciseId", deleteExercise);

export default app;
