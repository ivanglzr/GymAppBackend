import bcrypt from "bcrypt";

import User from "../models/user.model.js";

import {
  validateChangeUserData,
  validateLoginForm,
  validateUser,
} from "../schemas/user.schema.js";

import { statusMessages, SALT_ROUNDS } from "../config.js";

import { validateId, validatePassword } from "../functions.js";

export async function postUser(req, res) {
  const { data, error } = validateUser(req.body);

  if (error) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "User data isn't valid",
    });
  }

  const encriptedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const newUser = {
    ...data,
    password: encriptedPassword,
  };

  const user = new User(newUser);

  try {
    const email = newUser.email;

    const userInDb = await User.find({ email });

    if (userInDb.length > 0) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists in DB" });
    }

    await user.save();

    return res.status(201).json({
      status: statusMessages.success,
      message: "User registered",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while registering the new user",
    });
  }
}

export async function loginUser(req, res) {
  const { data, error } = validateLoginForm(req.body);

  if (error) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "Data isn't valid",
    });
  }

  try {
    const { email, password } = data;

    const userInDb = await User.findOne({ email });

    if (!userInDb) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    const isPasswordValid = await validatePassword(password, userInDb.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: statusMessages.error,
        message: "Login unauthorized",
      });
    }

    return res.json({
      status: statusMessages.success,
      message: "Authorized",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while login in",
    });
  }
}

export async function putUser(req, res) {
  const { id } = req.params;

  if (validateId(id)) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "Id isn't valid",
    });
  }

  const { data, error } = validateChangeUserData(req.body.user);

  if (error) {
    return res.status(400).json({
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
    const userInDb = await User.findById(id);

    if (!userInDb) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    const { password } = req.body;

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        status: statusMessages.error,
        message: "Password isn't valid",
      });
    }

    const { password: userPassword } = userInDb;

    const isPasswordValid = await validatePassword(password, userPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: statusMessages.error,
        message: "Unauthorized",
      });
    }

    await User.findByIdAndUpdate(id, { ...data });

    return res.json({
      status: statusMessages.success,
      message: "User updated",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while editing user",
    });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  if (validateId(id)) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "Id isn't valid",
    });
  }

  try {
    const userInDb = await User.findById(id);

    if (!userInDb) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    const { password } = req.body;

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        status: statusMessages.error,
        message: "Password isn't valid",
      });
    }

    const isPasswordValid = await validatePassword(password, userInDb.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: statusMessages.error,
        message: "Unauthorized",
      });
    }

    return res.json({
      status: statusMessages.success,
      message: "User deleted",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while deleting the user",
    });
  }
}
