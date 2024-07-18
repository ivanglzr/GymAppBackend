import express from "express";
import cors from "cors";

import {
  deleteUser,
  loginUser,
  postUser,
  putUser,
} from "./controllers/user.controller.js";

import {
  getTraining,
  postTraining,
} from "./controllers/training.controller.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cors());

app.get("/login", loginUser);
app.get("/user/:id/training/:trainingId?", getTraining);

app.post("/user", postUser);
app.post("/user/:id/training", postTraining);

app.put("/user/:id", putUser);

app.delete("/user/:id", deleteUser);

export default app;
