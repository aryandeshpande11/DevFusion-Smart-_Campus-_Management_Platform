// aggregates counts for the admin analytics dashboard
const db = require('../config/db');

async function getOverviewStats() {
  const [totalStudents, totalFaculty, totalDepartments, totalEvents] = await Promise.all([
    db.user.count({ where: { role: { name: 'student' } } }),
    db.user.count({ where: { role: { name: 'faculty' } } }),
    db.department.count(),
    db.event.count(),
  ]);

  return { totalStudents, totalFaculty, totalDepartments, totalEvents };
}

// average attendance percentage per course, useful for spotting low-attendance courses
async function getAttendanceStats() {
  const sessions = await db.attendanceSession.findMany({ include: { records: true, course: true } });

  const courseMap = {};
  for (const session of sessions) {
    const courseName = session.course.name;
    if (!courseMap[courseName]) courseMap[courseName] = { total: 0, present: 0 };
    for (const record of session.records) {
      courseMap[courseName].total += 1;
      if (record.status === 'present' || record.status === 'late') courseMap[courseName].present += 1;
    }
  }

  return Object.entries(courseMap).map(([courseName, counts]) => ({
    courseName,
    averagePercentage: counts.total ? Math.round((counts.present / counts.total) * 100) : 0,
  }));
}

async function getPlacementStats() {
  const [totalPlacements, totalApplications, totalSelected] = await Promise.all([
    db.placement.count(),
    db.placementApplication.count(),
    db.placementApplication.count({ where: { status: 'selected' } }),
  ]);

  return { totalPlacements, totalApplications, totalSelected };
}

async function getEventStats() {
  const events = await db.event.findMany({ select: { title: true, seatsTotal: true, seatsFilled: true } });
  return events;
}

module.exports = { getOverviewStats, getAttendanceStats, getPlacementStats, getEventStats };
