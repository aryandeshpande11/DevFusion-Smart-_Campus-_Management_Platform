// entry point - starts the http server and attaches socket.io on top of the express app
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const env = require('./src/config/env');
const registerSocketHandlers = require('./src/sockets/socketHandlers');
const { startScheduledJobs } = require('./src/jobs/deadlineReminderJob');
const logger = require('./src/utils/logger');

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: env.clientUrl, credentials: true },
});

// make io reachable from controllers/services via app.get('io')
app.set('io', io);
registerSocketHandlers(io);

httpServer.listen(env.port, () => {
  logger.info(`server running on port ${env.port} in ${env.nodeEnv} mode`);
  startScheduledJobs();
});
