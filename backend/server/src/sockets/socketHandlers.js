// registers socket namespaces/events - each connected client joins a room named after their userId
const { verifyAccessToken } = require('../utils/jwt');
const logger = require('../utils/logger');

function registerSocketHandlers(io) {
  io.use(function authenticateSocket(socket, next) {
    try {
      const token = socket.handshake.auth?.token;
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Unauthorized socket connection'));
    }
  });

  io.on('connection', function handleClientConnection(socket) {
    socket.join(socket.userId);
    logger.info(`socket connected: ${socket.userId}`);

    socket.on('disconnect', function handleClientDisconnect() {
      logger.info(`socket disconnected: ${socket.userId}`);
    });
  });
}

// helper other services import to push a notification event to one user's room
function emitNotificationToUser(io, userId, notification) {
  io.to(userId).emit('notification:new', notification);
}

// helper for live attendance session updates (who just marked present)
function emitAttendanceUpdate(io, sessionId, record) {
  io.emit(`attendance:session-live:${sessionId}`, record);
}

// helper for event seat count updates so registration pages stay live
function emitSeatUpdate(io, eventId, seatsFilled) {
  io.emit(`event:seat-update:${eventId}`, { seatsFilled });
}

module.exports = registerSocketHandlers;
module.exports.emitNotificationToUser = emitNotificationToUser;
module.exports.emitAttendanceUpdate = emitAttendanceUpdate;
module.exports.emitSeatUpdate = emitSeatUpdate;
