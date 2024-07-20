import bcrypt from "bcrypt";

import User from "../models/user.model.js";

import { statusMessages } from "../config.js";

export async function authenticateUser(req, res, next) {
  const { id } = req.params;

  if (id === undefined || id === null || id.length !== 24) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "Id isn't valid",
    });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(401).json({
      status: statusMessages.error,
      message: "Not authorized",
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      status: statusMessages.error,
      message: "User not found",
    });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({
      status: statusMessages.error,
      message: "Not authorized",
    });
  }

  next();
}
