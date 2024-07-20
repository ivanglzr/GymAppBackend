import "dotenv/config";

import mongoose from "mongoose";

import app from "./app.js";

mongoose
  .connect(process.env.DB_URI, {
    family: 4,
  })
  .then(() => console.log("Connected to DB"))
  .catch(() => console.error("Conexion failed"));

app.listen(process.env.PORT, () =>
  console.log("Server listening on port", process.env.PORT)
);
