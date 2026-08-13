const clubService = require('../services/clubService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');

const createClub = catchAsync(async function handleCreateClub(req, res) {
  const club = await clubService.createClub(req.currentUser.id, req.body);
  return sendSuccess(res, 201, 'Club created', { club });
});

const listClubs = catchAsync(async function handleListClubs(req, res) {
  const clubs = await clubService.listClubs();
  return sendSuccess(res, 200, 'Clubs fetched', { clubs });
});

const updateClub = catchAsync(async function handleUpdateClub(req, res) {
  const club = await clubService.updateClub(req.params.id, req.body);
  return sendSuccess(res, 200, 'Club updated', { club });
});

const deleteClub = catchAsync(async function handleDeleteClub(req, res) {
  await clubService.deleteClub(req.params.id);
  return sendSuccess(res, 200, 'Club deleted');
});

const joinClub = catchAsync(async function handleJoinClub(req, res) {
  const membership = await clubService.requestToJoinClub(req.params.id, req.currentUser.id);
  return sendSuccess(res, 201, 'Join request sent', { membership });
});

const updateMemberStatus = catchAsync(async function handleUpdateMemberStatus(req, res) {
  const membership = await clubService.updateMembershipStatus(req.params.id, req.params.userId, req.body.status);
  return sendSuccess(res, 200, 'Membership updated', { membership });
});

const getClubMembers = catchAsync(async function handleGetClubMembers(req, res) {
  const members = await clubService.getClubMembers(req.params.id);
  return sendSuccess(res, 200, 'Members fetched', { members });
});

module.exports = { createClub, listClubs, updateClub, deleteClub, joinClub, updateMemberStatus, getClubMembers };
