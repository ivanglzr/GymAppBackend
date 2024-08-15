import User from "../models/user.model.js";

import { statusMessages } from "../config.js";

import {
  validateTraining,
  validatePartialTraining,
} from "../schemas/training.schema.js";

export async function getTraining(req, res) {
  const { id } = req;

  const { trainingId } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    const { trainings } = user;

    const training = trainings.find((e) => e._id.toString() === trainingId);

    if (!training) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "Training not found",
      });
    }

    return res.json({
      status: statusMessages.success,
      message: "Training found",
      training,
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while getting trainings",
    });
  }
}

export async function getTrainings(req, res) {
  const { id } = req;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    const { trainings } = user;

    const message =
      trainings.length === 0
        ? "User doesn't have any trainings"
        : "Trainings found";

    return res.json({
      status: statusMessages.success,
      message,
      trainings,
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while finding the trainings",
    });
  }
}

export async function postTraining(req, res) {
  const { id } = req;

  const { data, error } = validateTraining(req.body);

  if (error) {
    return res.status(422).json({
      status: statusMessages.error,
      message: "Data isn't valid",
    });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    const newTrainings = [data, ...user.trainings];

    await User.findByIdAndUpdate(id, {
      trainings: newTrainings,
    });

    return res.status(201).json({
      status: statusMessages.success,
      message: "Training added",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while posting the training",
    });
  }
}

export async function putTraining(req, res) {
  const { id } = req;
  const { trainingId } = req.params;

  const { data, error } = validatePartialTraining(req.body);

  if (error) {
    return res.status(422).json({
      status: statusMessages.error,
      message: "Data isn't valid",
    });
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "There isn't any data",
    });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    const trainingIndex = user.trainings.findIndex(
      (e) => e._id.toString() === trainingId
    );

    if (trainingIndex === -1) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "Training not found",
      });
    }

    const newTrainings = user.trainings;
    newTrainings[trainingIndex] = data;

    await User.findByIdAndUpdate(id, { trainings: newTrainings });

    return res.json({
      status: statusMessages.success,
      message: "Training updated",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while editing the training",
    });
  }
}

export async function deleteTraining(req, res) {
  const { id } = req;
  const { trainingId } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    const newTrainings = user.trainings;

    const trainingIndex = newTrainings.findIndex(
      (e) => e._id.toString() === trainingId
    );

    if (trainingIndex === -1) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "Training not found",
      });
    }

    newTrainings.splice(trainingIndex, 1);

    await User.findByIdAndUpdate(id, { trainings: newTrainings });

    return res.json({
      status: statusMessages.success,
      message: "Training deleted",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while deleting the training",
    });
  }
}
