import logger from "./logger.js";

export const handleError = (res, title, error) => {
  logger.error(`Error in ${title}`);
  logger.error(error);
  return res.status(500).json({ error: "Internal server error" });
};
