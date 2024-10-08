import "dotenv/config";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

import {
  validateChangeUserData,
  validateLoginForm,
  validateUser,
} from "../schemas/user.schema.js";

import { statusMessages, SALT_ROUNDS } from "../config.js";

export async function loginUser(req, res) {
  const { data, error } = validateLoginForm(req.body);

  if (error) {
    return res.status(422).json({
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

    const isPasswordValid = await bcrypt.compare(password, userInDb.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: statusMessages.error,
        message: "Login unauthorized",
      });
    }

    const token = jwt.sign({ id: userInDb._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
      algorithm: "HS512",
    });

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      })
      .json({
        status: statusMessages.success,
        message: "Authorized",
      });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while login in",
    });
  }
}

export async function logoutUser(req, res) {
  return res
    .clearCookie("access_token")
    .json({ status: statusMessages.success, message: "Logout successful" });
}

export async function getUser(req, res) {
  const { id } = req;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    const userToSend = {
      name: user.name,
      age: user.age,
      weight: user.weight,
      height: user.height,
    };

    return res.json({
      status: statusMessages.success,
      message: "User sent",
      user: userToSend,
    });
  } catch (_) {
    return res.status(401).json({
      status: statusMessages.error,
      message: "Unauthorized",
    });
  }
}

export async function postUser(req, res) {
  const { data, error } = validateUser(req.body);

  if (error) {
    return res.status(422).json({
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
      message: "An error occurred while registering the new user",
    });
  }
}

export async function putUser(req, res) {
  const { id } = req;

  const { data, error } = validateChangeUserData(req.body);

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
    const user = await User.findByIdAndUpdate(id, { ...data });

    if (!user) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    return res.json({
      status: statusMessages.success,
      message: "User updated",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while editing user",
    });
  }
}

export async function deleteUser(req, res) {
  const { id } = req;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    return res.json({
      status: statusMessages.success,
      message: "User deleted",
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error occurred while deleting the user",
    });
  }
}
