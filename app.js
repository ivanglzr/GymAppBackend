import express from "express";
import cors from "cors";

import { authenticateUser } from "./middlewares/authenticateUser.js";
import { authenticateTrainingId } from "./middlewares/authenticateTrainingId.js";

import {
  deleteUser,
  loginUser,
  postUser,
  putUser,
} from "./controllers/user.controller.js";

import {
  deleteTraining,
  getTraining,
  postTraining,
  putTraining,
} from "./controllers/training.controller.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(cors());

app.use("/user/:id", authenticateUser);
app.use("/user/:id/training/:trainingId", authenticateTrainingId);

app.get("/login", loginUser);
app.get("/user/:id/training/:trainingId?", getTraining);

app.post("/user", postUser);
app.post("/user/:id/training", postTraining);

app.put("/user/:id", putUser);
app.put("/user/:id/training/:trainingId", putTraining);

app.delete("/user/:id", deleteUser);
app.delete("/user/:id/training/:trainingId", deleteTraining);

export default app;
