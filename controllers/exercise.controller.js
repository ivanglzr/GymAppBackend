import { Types } from "mongoose";

import Exercise from "../models/exercise.model.js";

import { statusMessages } from "../config.js";

import {
  validateExerciseSchema,
  validatePartialExerciseSchema,
} from "../schemas/exercise.schema.js";

export async function getUserExercises(req, res) {
  const { id } = req;

  try {
    const exercises = await Exercise.find({ userId: id });

    if (exercises.length <= 0) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "Exercises not found",
      });
    }

    return res.json({
      status: statusMessages.success,
      message: "User exercises found",
      exercises,
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while finding the exercises",
    });
  }
}

export async function getUserExerciseById(req, res) {
  const { exerciseId } = req.params;

  try {
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "Exercise not found",
      });
    }

    return res.json({
      status: statusMessages.success,
      message: "User exercise found",
      exercise,
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while finding the exercise",
    });
  }
}

export async function postExercise(req, res) {
  const { id } = req;

  const { data, error } = validateExerciseSchema(req.body);

  if (error) {
    return res.status(422).json({
      status: statusMessages.error,
      message: "Data isn't valid",
    });
  }

  try {
    const exerciseInDb = await Exercise.find({
      name: data.name,
      userId: new Types.ObjectId.createFromHexString(id),
    });

    if (exerciseInDb.length > 0) {
      return res.status(409).json({
        status: statusMessages.error,
        message: "You already created this exercise",
      });
    }

    const exercise = new Exercise({
      ...data,
      userId: new Types.ObjectId.createFromHexString(id),
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

export async function putExercise(req, res) {
  const { exerciseId } = req.params;

  const { data, error } = validatePartialExerciseSchema(req.body);

  if (error) {
    return res.status(422).json({
      status: statusMessages.error,
      message: "Exercise isn't valid",
    });
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "There isn't any data",
    });
  }

  try {
    const exercise = await Exercise.findByIdAndUpdate(exerciseId, { ...data });

    if (!exercise) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "Exercise not found",
      });
    }

    return res.json({
      status: statusMessages.success,
      message: "Exercise edited",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while editing the exercise",
    });
  }
}

export async function deleteExercise(req, res) {
  const { exerciseId } = req.params;

  try {
    const exercise = await Exercise.findByIdAndDelete(exerciseId);

    if (!exercise) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "Exercise not found",
      });
    }

    return res.json({
      status: statusMessages.success,
      message: "Exercise deleted",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while deleting the exercise",
    });
  }
}
