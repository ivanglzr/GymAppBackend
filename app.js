import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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
} from "./controllers/exercise.controller.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Asegúrate de que coincide con el origen del cliente
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

app.delete("/exercise/:exerciseId", deleteExercise);

export default app;
