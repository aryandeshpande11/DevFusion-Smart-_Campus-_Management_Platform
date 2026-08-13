const eventService = require('../services/eventService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');
const { emitSeatUpdate } = require('../sockets/socketHandlers');

const createEvent = catchAsync(async function handleCreateEvent(req, res) {
  const event = await eventService.createEvent(req.currentUser.id, req.body);
  return sendSuccess(res, 201, 'Event created', { event });
});

const uploadBanner = catchAsync(async function handleUploadBanner(req, res) {
  const event = await eventService.uploadEventBanner(req.params.id, req.file.buffer);
  return sendSuccess(res, 200, 'Banner uploaded', { event });
});

const listEvents = catchAsync(async function handleListEvents(req, res) {
  const events = await eventService.listEvents(req.query.filter);
  return sendSuccess(res, 200, 'Events fetched', { events });
});

const getEventById = catchAsync(async function handleGetEventById(req, res) {
  const event = await eventService.getEventById(req.params.id);
  return sendSuccess(res, 200, 'Event fetched', { event });
});

const updateEvent = catchAsync(async function handleUpdateEvent(req, res) {
  const event = await eventService.updateEvent(req.params.id, req.body);
  return sendSuccess(res, 200, 'Event updated', { event });
});

const deleteEvent = catchAsync(async function handleDeleteEvent(req, res) {
  await eventService.deleteEvent(req.params.id);
  return sendSuccess(res, 200, 'Event deleted');
});

const registerForEvent = catchAsync(async function handleRegisterForEvent(req, res) {
  const registration = await eventService.registerStudentForEvent(req.params.id, req.currentUser.id);
  const updatedEvent = await eventService.getEventById(req.params.id);
  const io = req.app.get('io');
  emitSeatUpdate(io, req.params.id, updatedEvent.seatsFilled);
  return sendSuccess(res, 201, 'Registered for event', { registration });
});

const cancelRegistration = catchAsync(async function handleCancelRegistration(req, res) {
  await eventService.cancelEventRegistration(req.params.id, req.currentUser.id);
  const updatedEvent = await eventService.getEventById(req.params.id);
  const io = req.app.get('io');
  emitSeatUpdate(io, req.params.id, updatedEvent.seatsFilled);
  return sendSuccess(res, 200, 'Registration cancelled');
});

const getMyTicket = catchAsync(async function handleGetMyTicket(req, res) {
  const ticket = await eventService.getEventTicket(req.params.id, req.currentUser.id);
  return sendSuccess(res, 200, 'Ticket fetched', { ticket });
});

const getAttendees = catchAsync(async function handleGetAttendees(req, res) {
  const attendees = await eventService.getEventAttendees(req.params.id);
  return sendSuccess(res, 200, 'Attendees fetched', { attendees });
});

const checkInAttendee = catchAsync(async function handleCheckInAttendee(req, res) {
  const registration = await eventService.checkInAttendee(req.body.qrPassUrl);
  return sendSuccess(res, 200, 'Attendee checked in', { registration });
});

module.exports = {
  createEvent,
  uploadBanner,
  listEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getMyTicket,
  getAttendees,
  checkInAttendee,
};
