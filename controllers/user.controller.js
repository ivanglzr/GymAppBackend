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
        httpOnly: true, // Evita acceso a la cookie desde JavaScript del lado del cliente
        secure: process.env.NODE_ENV === "production", // Asegúrate de usar https en producción
        sameSite: "lax", // Ajusta según tus necesidades
        maxAge: 60 * 60 * 1000, // 1 hora
      })
      .json({
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

export async function getUserByToken(req, res) {
  const token = req.cookies.access_token;

  console.log(token);

  if (!token) {
    return res.status(401).json({
      status: statusMessages.error,
      message: "Token is missing",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    if (!id) {
      return res.status(400).json({
        status: statusMessages.error,
        message: "Id is missing",
      });
    }

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
      trainings: user.trainings,
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

export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: statusMessages.error,
        message: "User not found",
      });
    }

    return res.json({
      status: statusMessages.success,
      message: "User found",
      user,
    });
  } catch (_) {
    return res.status(500).json({
      status: statusMessages.error,
      message: "An error ocurred while finding the user",
    });
  }
}

export async function postUser(req, res) {
  const { data, error } = validateUser(req.body.user);

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
        .status(409)
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

export async function putUser(req, res) {
  const { id } = req.params;

  const { data, error } = validateChangeUserData(req.body.user);

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
      message: "An error ocurred while editing user",
    });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

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
      message: "An error ocurred while deleting the user",
    });
  }
}
