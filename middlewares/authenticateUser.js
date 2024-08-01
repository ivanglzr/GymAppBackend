import "dotenv/config";

import jwt from "jsonwebtoken";

import { statusMessages } from "../config.js";

export async function authenticateUser(req, res, next) {
  if (req.method === "POST" && req.originalUrl === "/user/") {
    return next();
  }

  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      status: statusMessages.error,
      message: "Unauthorized",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    if (id === undefined || id === null || id.length !== 24) {
      return res.status(400).json({
        status: statusMessages.error,
        message: "Id isn't valid",
      });
    }

    req.id = id;
  } catch (_) {
    return res.status(401).json({
      status: statusMessages.error,
      message: "Unauthorized",
    });
  }

  next();
}
