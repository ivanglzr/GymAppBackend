import "dotenv/config";

import jwt from "jsonwebtoken";

import { statusMessages } from "../config.js";

export async function authenticateUser(req, res, next) {
  const { id } = req.params;

  if (id === undefined || id === null || id.length !== 24) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "Id isn't valid",
    });
  }

  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      status: statusMessages.error,
      message: "Unauthorized",
    });
  }

  try {
    const { id: tokenId } = jwt.verify(token, process.env.SECRET_KEY);

    if (!tokenId) {
      return res.status(400).json({
        status: statusMessages.error,
        message: "Id is missing",
      });
    }

    if (tokenId !== id) {
      return res.status(401).json({
        status: statusMessages.error,
        message: "Unauthorized",
      });
    }
  } catch (_) {
    return res.status(401).json({
      status: statusMessages.error,
      message: "Unauthorized",
    });
  }

  next();
}
