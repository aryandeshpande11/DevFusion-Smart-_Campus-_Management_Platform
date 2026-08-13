// business logic for placement drives: admin posts jobs, students apply and track status
const db = require('../config/db');
const AppError = require('../utils/appError');

async function createPlacement(adminId, placementData) {
  return db.placement.create({ data: { ...placementData, createdBy: adminId } });
}

async function listPlacements() {
  return db.placement.findMany({ orderBy: { deadline: 'asc' } });
}

async function getPlacementById(placementId) {
  const placement = await db.placement.findUnique({ where: { id: placementId } });
  if (!placement) throw new AppError('Placement not found', 404);
  return placement;
}

async function updatePlacement(placementId, updates) {
  return db.placement.update({ where: { id: placementId }, data: updates });
}

async function deletePlacement(placementId) {
  await db.placement.delete({ where: { id: placementId } });
}

// student applies with their resume url snapshot (in case they update resume later)
async function applyToPlacement(placementId, studentId, resumeUrl) {
  const existingApplication = await db.placementApplication.findUnique({
    where: { placementId_studentId: { placementId, studentId } },
  });
  if (existingApplication) throw new AppError('You already applied to this placement', 400);

  return db.placementApplication.create({ data: { placementId, studentId, resumeUrl } });
}

async function getApplicationsForPlacement(placementId) {
  return db.placementApplication.findMany({
    where: { placementId },
    include: { student: true },
    orderBy: { appliedAt: 'desc' },
  });
}

async function updateApplicationStatus(applicationId, status) {
  return db.placementApplication.update({ where: { id: applicationId }, data: { status } });
}

async function getMyApplications(studentId) {
  return db.placementApplication.findMany({
    where: { studentId },
    include: { placement: true },
    orderBy: { appliedAt: 'desc' },
  });
}

module.exports = {
  createPlacement,
  listPlacements,
  getPlacementById,
  updatePlacement,
  deletePlacement,
  applyToPlacement,
  getApplicationsForPlacement,
  updateApplicationStatus,
  getMyApplications,
};
