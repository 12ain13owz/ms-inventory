import logger from "pino";
import dayjs from "dayjs";

const level = "info"; // fatal, error, warn, info, debug, trace
const log = logger({
  transport: {
    target: "pino-pretty",
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
