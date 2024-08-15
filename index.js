import "dotenv/config";

import mongoose from "mongoose";

import app from "./app.js";

const PORT = process.env.PORT ?? 3900;

mongoose
  .connect(process.env.DB_URI, {
    family: 4,
  })
  .then(() => console.log("Connected to DB"))
  .catch(() => console.error("Conexion failed"));

app.listen(PORT, () => console.log("Server listening on port", PORT));
