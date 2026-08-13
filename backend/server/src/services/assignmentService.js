// business logic for assignments: faculty create/review, students submit
const db = require('../config/db');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/appError');

async function createAssignment(facultyId, { courseId, title, description, deadline, rubric }) {
  return db.assignment.create({
    data: { courseId, facultyId, title, description, deadline: new Date(deadline), rubric },
  });
}

async function getAssignmentsForCourse(courseId) {
  return db.assignment.findMany({ where: { courseId }, orderBy: { deadline: 'asc' } });
}

async function getAssignmentById(assignmentId) {
  const assignment = await db.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) throw new AppError('Assignment not found', 404);
  return assignment;
}

async function updateAssignment(assignmentId, updates) {
  return db.assignment.update({ where: { id: assignmentId }, data: updates });
}

async function deleteAssignment(assignmentId) {
  await db.assignment.delete({ where: { id: assignmentId } });
}

// student submits either a file (uploaded to cloudinary) or a github link, marked late if past deadline
async function submitAssignment(assignmentId, studentId, { fileBuffer, githubLink }) {
  const assignment = await db.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) throw new AppError('Assignment not found', 404);

  let fileUrl = null;
  if (fileBuffer) {
    const uploadResult = await uploadSubmissionFile(fileBuffer);
    fileUrl = uploadResult.secure_url;
  }

  const isLate = new Date() > new Date(assignment.deadline);

  return db.assignmentSubmission.upsert({
    where: { assignmentId_studentId: { assignmentId, studentId } },
    update: { fileUrl, githubLink, isLate, submittedAt: new Date(), status: 'pending' },
    create: { assignmentId, studentId, fileUrl, githubLink, isLate, status: 'pending' },
  });
}

function uploadSubmissionFile(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'campus/submissions', resource_type: 'auto' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

async function getSubmissionsForAssignment(assignmentId) {
  return db.assignmentSubmission.findMany({
    where: { assignmentId },
    include: { student: true },
    orderBy: { submittedAt: 'desc' },
  });
}

// faculty grades a submission with marks + written feedback
async function reviewSubmission(submissionId, { marks, feedback }) {
  return db.assignmentSubmission.update({
    where: { id: submissionId },
    data: { marks, feedback, status: 'reviewed' },
  });
}

async function getMySubmissions(studentId) {
  return db.assignmentSubmission.findMany({
    where: { studentId },
    include: { assignment: true },
    orderBy: { submittedAt: 'desc' },
  });
}

module.exports = {
  createAssignment,
  getAssignmentsForCourse,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissionsForAssignment,
  reviewSubmission,
  getMySubmissions,
};
