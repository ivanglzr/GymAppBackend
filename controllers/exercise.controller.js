import mongoose from "mongoose";

import Exercise from "../models/exercise.model.js";

import { statusMessages } from "../config.js";

import { validateExerciseSchema } from "../schemas/exercise.schema.js";

export async function postExercise(req, res) {
  const { data, error } = validateExerciseSchema(req.body.exercise);

  if (error) {
    return res.status(422).json({
      status: statusMessages.error,
      message: "Data isn't valid",
    });
  }

  try {
    const exerciseInDb = await Exercise.find({
      name: data.name,
      userId: new mongoose.Types.ObjectId(data.userId),
    });

    if (exerciseInDb.length > 0) {
      return res.status(409).json({
        status: statusMessages.error,
        message: "You already created this exercise",
      });
    }

    const exercise = new Exercise({
      ...data,
      userId: new mongoose.Types.ObjectId(data.userId),
    });

    await exercise.save();

    return res.status(201).json({
      status: statusMessages.success,
      message: "Exercise created",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while posting the exercise",
    });
  }
}
