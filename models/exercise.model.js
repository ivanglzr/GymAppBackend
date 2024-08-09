import mongoose from "mongoose";

import { exerciseEquipments, muscularGroups } from "../config.js";

const ExerciseModel = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  equipment: {
    type: String,
    enum: exerciseEquipments,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  muscles: {
    type: String,
    enum: muscularGroups,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Exercise", ExerciseModel);
