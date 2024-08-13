import { statusMessages } from "../config.js";

export async function authenticateExerciseId(req, res, next) {
  if (req.originalUrl.includes("/exercise/image")) {
    return next();
  }

  const { exerciseId } = req.params;

  if (
    exerciseId === undefined ||
    exerciseId === null ||
    exerciseId.length !== 24
  ) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "Id isn't valid",
    });
  }

  next();
}
