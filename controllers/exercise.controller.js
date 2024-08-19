import fs from "node:fs/promises";
import path from "node:path";

import { Types } from "mongoose";
import Exercise from "../models/exercise.model.js";

import {
  statusMessages,
  imagesDirectory,
  defaultImageName,
} from "../config.js";

import {
  validateExerciseSchema,
  validatePartialExerciseSchema,
} from "../schemas/exercise.schema.js";

const getImagePath = imageName =>
  path.join(process.cwd(), imagesDirectory, imageName);

const deleteImage = async imagePath => {
  if (imagePath && imagePath !== `${imagesDirectory}/${defaultImageName}`) {
    try {
      await fs.unlink(path.join(process.cwd(), imagePath));
    } catch (err) {}
  }
};

export async function getUserExercises(req, res) {
  const { id } = req;

  try {
    const exercises = await Exercise.find({ userId: id });

    const message =
      exercises.length === 0
        ? "User doesn't have any exercises"
        : "User exercises found";

    return res.json({
      status: statusMessages.success,
      message,
      exercises,
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while finding the exercises",
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
      message: "An error occurred while finding the exercise",
    });
  }
}

export async function getImage(req, res) {
  const { image } = req.params;

  const imagePath = getImagePath(image);

  try {
    await fs.access(imagePath);
    return res.sendFile(imagePath);
  } catch (err) {
    const defaultImagePath = getImagePath(defaultImageName);
    try {
      await fs.access(defaultImagePath);
      return res.sendFile(defaultImagePath);
    } catch (_) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "Image not found",
      });
    }
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
    const exerciseInDb = await Exercise.findOne({
      name: data.name,
      userId: Types.ObjectId.createFromHexString(id),
    });

    if (exerciseInDb) {
      return res.status(409).json({
        status: statusMessages.error,
        message: "You already created this exercise",
      });
    }

    const exercise = new Exercise({
      ...data,
      userId: Types.ObjectId.createFromHexString(id),
      image: defaultImageName,
    });

    const { _id } = await exercise.save();

    return res.status(201).json({
      status: statusMessages.success,
      message: "Exercise created",
      id: _id,
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while posting the exercise",
    });
  }
}

export async function uploadImage(req, res) {
  const { file } = req;

  if (!file) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "There isn't an image",
    });
  }

  const ext = file.mimetype.split("/")[1];

  if (ext !== "png" && ext !== "jpeg" && ext !== "jpg" && ext !== "png") {
    await deleteImage(file.path);

    return res.status(400).json({
      status: statusMessages.error,
      message: "File type isn't valid",
    });
  }

  const { exerciseId } = req.params;

  try {
    const exercise = await Exercise.findByIdAndUpdate(exerciseId, {
      image: file.filename,
    });

    if (!exercise) {
      await deleteImage(file.path);

      return res.status(404).json({
        status: statusMessages.error,
        message: "Exercise not found",
      });
    }

    await deleteImage(`${imagesDirectory}/${exercise.image}`);

    return res.json({
      status: statusMessages.success,
      message: "Image uploaded",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while uploading the image",
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
      message: "No data provided",
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
      message: "Exercise updated",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while updating the exercise",
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

    await deleteImage(`${imagesDirectory}/${exercise.image}`);

    return res.json({
      status: statusMessages.success,
      message: "Exercise deleted",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while deleting the exercise",
    });
  }
}
