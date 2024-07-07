import mongoose from "mongoose";

import app from "./app.js";

import { URI, PORT } from "./config.js";

mongoose
  .connect(URI, {
    family: 4,
  })
  .then(() => console.log("Connected to DB"))
  .catch(() => console.error("Conexion failed"));

app.listen(PORT, () => console.log("Server listening on port", PORT));
