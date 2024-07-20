import { statusMessages } from "../config.js";

export async function authenticateTrainingId(req, res, next) {
  if (req.method === "GET") {
    return next();
  }

  const { trainingId } = req.params;

  if (
    trainingId === undefined ||
    trainingId === null ||
    trainingId.length !== 24
  ) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "Id isn't valid",
    });
  }

  next();
}
