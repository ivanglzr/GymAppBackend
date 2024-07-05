import express from "express";
import cors from "cors";

import { loginUser } from "./controllers/user.controller.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
  return res.status(200).json({ message: "Hola" });
});

app.post("/login", loginUser);

export default app;
