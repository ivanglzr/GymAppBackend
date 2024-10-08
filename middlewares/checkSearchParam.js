import { statusMessages } from "../config.js";
import { blockIP } from "./blockIp.js";

export async function checkSearchParam(req, res, next) {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({
      status: statusMessages.error,
      message: "Search is required",
    });
  }

  const sanitazedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (search !== sanitazedSearch) {
    blockIP(req.ip);
    return res.status(403).json({
      status: statusMessages.error,
      message: "You have been banned from the server",
    });
  }

  next();
}
