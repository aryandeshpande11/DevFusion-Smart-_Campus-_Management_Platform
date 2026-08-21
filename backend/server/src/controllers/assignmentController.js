const assignmentService = require('../services/assignmentService');
const notificationService = require('../services/notificationService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');
const { emitNotificationToUser } = require('../sockets/socketHandlers');

const createAssignment = catchAsync(async function handleCreateAssignment(req, res) {
  const assignment = await assignmentService.createAssignment(req.currentUser.id, req.body);
  return sendSuccess(res, 201, 'Assignment created', { assignment });
});

const getAssignmentsForCourse = catchAsync(async function handleGetAssignmentsForCourse(req, res) {
  const assignments = await assignmentService.getAssignmentsForCourse(req.params.courseId);
  return sendSuccess(res, 200, 'Assignments fetched', { assignments });
});

const getAssignmentById = catchAsync(async function handleGetAssignmentById(req, res) {
  const assignment = await assignmentService.getAssignmentById(req.params.id);
  return sendSuccess(res, 200, 'Assignment fetched', { assignment });
});

const updateAssignment = catchAsync(async function handleUpdateAssignment(req, res) {
  const assignment = await assignmentService.updateAssignment(req.params.id, req.body);
  return sendSuccess(res, 200, 'Assignment updated', { assignment });
});

const deleteAssignment = catchAsync(async function handleDeleteAssignment(req, res) {
  await assignmentService.deleteAssignment(req.params.id);
  return sendSuccess(res, 200, 'Assignment deleted');
});

const submitAssignment = catchAsync(async function handleSubmitAssignment(req, res) {
  const submission = await assignmentService.submitAssignment(req.params.id, req.currentUser.id, {
    fileBuffer: req.file?.buffer,
    githubLink: req.body.githubLink,
  });
  return sendSuccess(res, 201, 'Assignment submitted', { submission });
});

const getSubmissions = catchAsync(async function handleGetSubmissions(req, res) {
  const submissions = await assignmentService.getSubmissionsForAssignment(req.params.id);
  return sendSuccess(res, 200, 'Submissions fetched', { submissions });
});

const reviewSubmission = catchAsync(async function handleReviewSubmission(req, res) {
  const submission = await assignmentService.reviewSubmission(req.params.id, req.body);

  const notification = await notificationService.createNotification(submission.studentId, {
    type: 'assignment_reviewed',
    title: 'Assignment graded',
    message: `Your submission was reviewed — marks: ${submission.marks ?? 'N/A'}`,
    link: `/app/student/assignments`,
  });
  emitNotificationToUser(req.app.get('io'), submission.studentId, notification);

  return sendSuccess(res, 200, 'Submission reviewed', { submission });
});

const getMySubmissions = catchAsync(async function handleGetMySubmissions(req, res) {
  const submissions = await assignmentService.getMySubmissions(req.currentUser.id);
  return sendSuccess(res, 200, 'Your submissions fetched', { submissions });
});

// full assignment list for the student dashboard — every assignment posted
// to a course matching their department/semester, submitted or not
const getMyAssignments = catchAsync(async function handleGetMyAssignments(req, res) {
  const assignments = await assignmentService.getAssignmentsForStudent(req.currentUser.id);
  return sendSuccess(res, 200, 'Your assignments fetched', { assignments });
});

module.exports = {
  createAssignment,
  getAssignmentsForCourse,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
  reviewSubmission,
  getMySubmissions,
  getMyAssignments,
};