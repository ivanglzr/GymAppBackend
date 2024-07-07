import User from "../models/user.model.js";

import { statusMessages } from "../config.js";

import { validateTraining } from "../schemas/user.schema.js";

export async function postTraining(req, res) {
  const { id } = req.params;

  if (id === undefined || id === null || id.length !== 24) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "Id isn't valid",
    });
  }

  const { data, error } = validateTraining(req.body);

  if (error) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "Data isn't valid",
    });
  }

  try {
    const user = await User.findById(id);

    const newTrainings = user.trainings.push(data);

    await User.findByIdAndUpdate(id, {
      ...user,
      trainings: newTrainings,
    });

    return res.status(201).json({
      status: statusMessages.success,
      message: "Training added",
    });
  } catch (err) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while posting the training",
    });
  }
}
