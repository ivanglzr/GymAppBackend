import express from "express";
import cors from "cors";

import { registerUser } from "./controllers/user.controller.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
  return res.status(200).json({ message: "Hola" });
});

app.post("/register", registerUser);

export default app;
