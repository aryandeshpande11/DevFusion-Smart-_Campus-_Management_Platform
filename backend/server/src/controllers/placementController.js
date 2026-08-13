const placementService = require('../services/placementService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');

const createPlacement = catchAsync(async function handleCreatePlacement(req, res) {
  const placement = await placementService.createPlacement(req.currentUser.id, req.body);
  return sendSuccess(res, 201, 'Placement posted', { placement });
});

const listPlacements = catchAsync(async function handleListPlacements(req, res) {
  const placements = await placementService.listPlacements();
  return sendSuccess(res, 200, 'Placements fetched', { placements });
});

const getPlacementById = catchAsync(async function handleGetPlacementById(req, res) {
  const placement = await placementService.getPlacementById(req.params.id);
  return sendSuccess(res, 200, 'Placement fetched', { placement });
});

const updatePlacement = catchAsync(async function handleUpdatePlacement(req, res) {
  const placement = await placementService.updatePlacement(req.params.id, req.body);
  return sendSuccess(res, 200, 'Placement updated', { placement });
});

const deletePlacement = catchAsync(async function handleDeletePlacement(req, res) {
  await placementService.deletePlacement(req.params.id);
  return sendSuccess(res, 200, 'Placement deleted');
});

const applyToPlacement = catchAsync(async function handleApplyToPlacement(req, res) {
  const application = await placementService.applyToPlacement(req.params.id, req.currentUser.id, req.currentUser.resumeUrl);
  return sendSuccess(res, 201, 'Application submitted', { application });
});

const getApplications = catchAsync(async function handleGetApplications(req, res) {
  const applications = await placementService.getApplicationsForPlacement(req.params.id);
  return sendSuccess(res, 200, 'Applications fetched', { applications });
});

const updateApplicationStatus = catchAsync(async function handleUpdateApplicationStatus(req, res) {
  const application = await placementService.updateApplicationStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, 'Application status updated', { application });
});

const getMyApplications = catchAsync(async function handleGetMyApplications(req, res) {
  const applications = await placementService.getMyApplications(req.currentUser.id);
  return sendSuccess(res, 200, 'Your applications fetched', { applications });
});

module.exports = {
  createPlacement,
  listPlacements,
  getPlacementById,
  updatePlacement,
  deletePlacement,
  applyToPlacement,
  getApplications,
  updateApplicationStatus,
  getMyApplications,
};
