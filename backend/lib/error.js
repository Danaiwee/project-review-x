import logger from "./logger.js";

export const handleError = (res, title, error) => {
  logger.error(`Error in ${text}`, error.message || error);
  return res.status(500).json({ error: "Internal server error" });
};
