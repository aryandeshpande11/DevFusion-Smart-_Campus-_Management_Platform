// tiny console logger wrapper, easy to swap for winston/pino later without touching call sites
const logger = {
  info: (message, meta = '') => console.log(`[INFO] ${message}`, meta),
  error: (message, meta = '') => console.error(`[ERROR] ${message}`, meta),
  warn: (message, meta = '') => console.warn(`[WARN] ${message}`, meta),
};

module.exports = logger;
