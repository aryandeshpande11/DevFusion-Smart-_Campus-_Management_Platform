// scheduled background tasks - reminders for assignments due soon, run once a day
const cron = require('node-cron');
const db = require('../config/db');
const { sendDeadlineReminderEmail } = require('../utils/mailer');
const logger = require('../utils/logger');

// finds assignments due within the next 24 hours and emails every student in that course
async function sendUpcomingDeadlineReminders() {
  const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const dueSoonAssignments = await db.assignment.findMany({
    where: { deadline: { lte: oneDayFromNow, gte: new Date() } },
    include: { course: true },
  });

  for (const assignment of dueSoonAssignments) {
    const studentsInCourse = await db.user.findMany({
      where: { departmentId: assignment.course.departmentId, semester: assignment.course.semester },
    });

    for (const student of studentsInCourse) {
      await sendDeadlineReminderEmail(student.email, assignment.title, assignment.deadline);
    }
  }

  logger.info(`deadline reminders sent for ${dueSoonAssignments.length} assignments`);
}

// runs every day at 8am server time
function startScheduledJobs() {
  cron.schedule('0 8 * * *', sendUpcomingDeadlineReminders);
  logger.info('cron jobs scheduled');
}

module.exports = { startScheduledJobs, sendUpcomingDeadlineReminders };
