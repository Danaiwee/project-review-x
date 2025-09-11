import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

const logger = pino({
  level: process.env.LOG_LEVEL || "info", //info, warn, error (no debug and trace)
  transport: !isProduction
    ? {
        target: "pino-pretty", //makes them human-friendly.
        options: {
          colorize: true, //adds colors for levels (INFO green, ERROR red).
          ignore: "pid,hostname", // hides process ID & hostname from log output.
          translateTime: "SYS:standard", //adds a readable timestamp (e.g. 2025-09-10 11:03:12)
        },
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }), //transforms message into uppercase
  },
  timestamp: pino.stdTimeFunctions.isoTime, //eg."2025-09-10T11:05:23.456Z"
});

export default logger;
