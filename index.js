import mongoose from "mongoose";

import app from "./app.js";

const URI = "mongodb://localhost:27017/gym-app";
const PORT = process.env.PORT ?? 3900;

mongoose
  .connect(URI, {
    family: 4,
  })
  .then(() => console.log("Connected to DB"))
  .catch(() => console.error("Conexion failed"));

app.listen(PORT, () => console.log("Server listening on port", PORT));
