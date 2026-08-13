// business logic for events: create/list, seat-limited registration, qr pass + check-in
const { v4: uuidV4 } = require('uuid');
const db = require('../config/db');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/appError');

async function createEvent(creatorId, eventData) {
  return db.event.create({ data: { ...eventData, createdBy: creatorId } });
}

async function uploadEventBanner(eventId, fileBuffer) {
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'campus/events' }, (error, result) =>
      error ? reject(error) : resolve(result)
    );
    stream.end(fileBuffer);
  });

  return db.event.update({ where: { id: eventId }, data: { bannerUrl: uploadResult.secure_url } });
}

async function listEvents(filter = 'all') {
  const now = new Date();
  const where =
    filter === 'upcoming'
      ? { registrationDeadline: { gte: now } }
      : filter === 'past'
      ? { registrationDeadline: { lt: now } }
      : {};

  return db.event.findMany({ where, orderBy: { registrationDeadline: 'asc' } });
}

async function getEventById(eventId) {
  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event) throw new AppError('Event not found', 404);
  return event;
}

async function updateEvent(eventId, updates) {
  return db.event.update({ where: { id: eventId }, data: updates });
}

async function deleteEvent(eventId) {
  await db.event.delete({ where: { id: eventId } });
}

// registers a student if seats remain, generates a unique qr pass token
async function registerStudentForEvent(eventId, studentId) {
  return db.$transaction(async (tx) => {
    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError('Event not found', 404);
    if (event.seatsFilled >= event.seatsTotal) throw new AppError('This event is fully booked', 400);
    if (new Date() > new Date(event.registrationDeadline)) throw new AppError('Registration is closed', 400);

    const qrPassUrl = uuidV4();

    const registration = await tx.eventRegistration.create({
      data: { eventId, studentId, qrPassUrl },
    });

    await tx.event.update({ where: { id: eventId }, data: { seatsFilled: { increment: 1 } } });

    return registration;
  });
}

async function cancelEventRegistration(eventId, studentId) {
  return db.$transaction(async (tx) => {
    const registration = await tx.eventRegistration.findUnique({
      where: { eventId_studentId: { eventId, studentId } },
    });
    if (!registration) throw new AppError('Registration not found', 404);

    await tx.eventRegistration.update({
      where: { id: registration.id },
      data: { status: 'cancelled' },
    });
    await tx.event.update({ where: { id: eventId }, data: { seatsFilled: { decrement: 1 } } });
  });
}

async function getEventTicket(eventId, studentId) {
  const registration = await db.eventRegistration.findUnique({
    where: { eventId_studentId: { eventId, studentId } },
  });
  if (!registration) throw new AppError('You are not registered for this event', 404);
  return registration;
}

async function getEventAttendees(eventId) {
  return db.eventRegistration.findMany({
    where: { eventId, status: 'registered' },
    include: { student: true },
  });
}

// coordinator scans a student's qr pass at the door
async function checkInAttendee(qrPassUrl) {
  const registration = await db.eventRegistration.findFirst({ where: { qrPassUrl } });
  if (!registration) throw new AppError('Invalid ticket', 400);
  if (registration.checkedIn) throw new AppError('This ticket has already been checked in', 400);

  return db.eventRegistration.update({
    where: { id: registration.id },
    data: { checkedIn: true },
  });
}

module.exports = {
  createEvent,
  uploadEventBanner,
  listEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerStudentForEvent,
  cancelEventRegistration,
  getEventTicket,
  getEventAttendees,
  checkInAttendee,
};
