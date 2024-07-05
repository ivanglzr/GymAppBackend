import User from "../models/user.model.js";
import { validateUser } from "../schemas/user.schema.js";
import { statusCodes } from "../config.js";

export async function registerUser(req, res) {
  const userData = validateUser(req.body);

  if (userData.error) {
    return res.status(400).json({
      status: statusCodes.error,
      message: "User data isn't valid",
    });
  }

  const user = new User(userData.data);

  try {
    const email = userData.data.email;

    const userInDb = await User.find({ email });

    if (userInDb.length > 0) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists in DB" });
    }

    await user.save();

    res.setHeader("Content-Type", "application/json");

    return res.status(201).json({
      status: statusCodes.success,
      message: "User registered",
    });
  } catch (err) {
    return res.status(500).json({
      status: statusCodes.error,
      message: "An error ocurred while registering the new user",
    });
  }
}
