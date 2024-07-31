import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authenticateUser } from "./middlewares/authenticateUser.js";
import { authenticateTrainingId } from "./middlewares/authenticateTrainingId.js";

import {
  loginUser,
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

import { postExercise } from "./controllers/exercise.controller.js";

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
app.get("/user/training/:trainingId?", getTraining);

app.post("/login", loginUser);
app.post("/user", postUser);
app.post("/user/training", postTraining);

app.put("/user", putUser);
app.put("/user/training/:trainingId", putTraining);

app.delete("/user", deleteUser);
app.delete("/user/training/:trainingId", deleteTraining);

app.post("/exercise", postExercise);

export default app;
