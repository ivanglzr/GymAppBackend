import express from "express";
import cors from "cors";

import { loginUser, postUser, putUser } from "./controllers/user.controller.js";

import { postTraining } from "./controllers/training.controller.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cors());

app.get("/login", loginUser);

app.post("/user", postUser);
app.post("/user/:id/training", postTraining);

app.put("/user/:id", putUser);

export default app;
