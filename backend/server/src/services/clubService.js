// business logic for clubs: coordinators manage clubs, students request to join
const db = require('../config/db');
const AppError = require('../utils/appError');

async function createClub(coordinatorId, { name, description }) {
  return db.club.create({ data: { name, description, coordinatorId } });
}

async function listClubs() {
  return db.club.findMany({ include: { coordinator: true }, orderBy: { name: 'asc' } });
}

async function updateClub(clubId, updates) {
  return db.club.update({ where: { id: clubId }, data: updates });
}

async function deleteClub(clubId) {
  await db.club.delete({ where: { id: clubId } });
}

// student requests to join, sits pending until coordinator approves
async function requestToJoinClub(clubId, studentId) {
  const existingRequest = await db.clubMembership.findUnique({
    where: { clubId_studentId: { clubId, studentId } },
  });
  if (existingRequest) throw new AppError('You already requested to join this club', 400);

  return db.clubMembership.create({ data: { clubId, studentId, status: 'pending' } });
}

async function updateMembershipStatus(clubId, studentId, status) {
  return db.clubMembership.update({
    where: { clubId_studentId: { clubId, studentId } },
    data: { status },
  });
}

async function getClubMembers(clubId) {
  return db.clubMembership.findMany({
    where: { clubId, status: 'approved' },
    include: { student: true },
  });
}

module.exports = {
  createClub,
  listClubs,
  updateClub,
  deleteClub,
  requestToJoinClub,
  updateMembershipStatus,
  getClubMembers,
};
