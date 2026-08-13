// business logic for creating sessions, marking students present, and generating attendance reports
const { v4: uuidV4 } = require('uuid');
const db = require('../config/db');
const AppError = require('../utils/appError');

// faculty starts a class session, gets a fresh qr token students can scan
async function createAttendanceSession(facultyId, { courseId, date, startTime, endTime }) {
  const qrToken = uuidV4();

  return db.attendanceSession.create({
    data: {
      courseId,
      facultyId,
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      qrToken,
      status: 'open',
    },
  });
}

async function getSessionsForCourse(courseId) {
  return db.attendanceSession.findMany({
    where: { courseId },
    include: { records: true },
    orderBy: { date: 'desc' },
  });
}

// faculty manually marks a specific student in a session
async function markAttendanceManually(sessionId, studentId, status) {
  const session = await db.attendanceSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new AppError('Attendance session not found', 404);

  return db.attendanceRecord.upsert({
    where: { sessionId_studentId: { sessionId, studentId } },
    update: { status, method: 'manual', markedAt: new Date() },
    create: { sessionId, studentId, status, method: 'manual' },
  });
}

// student self-marks by scanning the session qr code
async function markAttendanceByQrScan(studentId, qrToken) {
  const session = await db.attendanceSession.findUnique({ where: { qrToken } });
  if (!session) throw new AppError('Invalid or expired QR code', 400);
  if (session.status !== 'open') throw new AppError('This attendance session is closed', 400);

  return db.attendanceRecord.upsert({
    where: { sessionId_studentId: { sessionId: session.id, studentId } },
    update: { status: 'present', method: 'qr', markedAt: new Date() },
    create: { sessionId: session.id, studentId, status: 'present', method: 'qr' },
  });
}

async function getStudentAttendanceHistory(studentId) {
  return db.attendanceRecord.findMany({
    where: { studentId },
    include: { session: { include: { course: true } } },
    orderBy: { markedAt: 'desc' },
  });
}

// computes overall + subject-wise attendance percentage for a student
async function getStudentAttendanceSummary(studentId) {
  const records = await db.attendanceRecord.findMany({
    where: { studentId },
    include: { session: { include: { course: true } } },
  });

  const subjectMap = {};
  for (const record of records) {
    const courseName = record.session.course.name;
    if (!subjectMap[courseName]) subjectMap[courseName] = { total: 0, present: 0 };
    subjectMap[courseName].total += 1;
    if (record.status === 'present' || record.status === 'late') subjectMap[courseName].present += 1;
  }

  const subjectWise = Object.entries(subjectMap).map(([courseName, counts]) => ({
    courseName,
    percentage: Math.round((counts.present / counts.total) * 100),
  }));

  const totalClasses = records.length;
  const totalPresent = records.filter((r) => r.status === 'present' || r.status === 'late').length;
  const overallPercentage = totalClasses ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return { overallPercentage, subjectWise };
}

async function getCourseAttendanceReport(courseId) {
  const sessions = await db.attendanceSession.findMany({
    where: { courseId },
    include: { records: { include: { student: true } } },
  });
  return sessions;
}

module.exports = {
  createAttendanceSession,
  getSessionsForCourse,
  markAttendanceManually,
  markAttendanceByQrScan,
  getStudentAttendanceHistory,
  getStudentAttendanceSummary,
  getCourseAttendanceReport,
};
