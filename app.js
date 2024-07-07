import express from "express";
import cors from "cors";

import {
  loginUser,
  postUser,
  postTraining,
} from "./controllers/user.controller.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
  console.log(req.query);
  return res.status(200).json({ message: "Hola" });
});

app.get("/register", loginUser);

app.post("/user", postUser);

app.post("/user/:id/training", postTraining);

export default app;
