// zod schemas guarding attendance session creation and marking
const { z } = require('zod');

const createSessionSchema = z.object({
  courseId: z.string().uuid(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
});

const markAttendanceSchema = z.object({
  studentId: z.string().uuid(),
  status: z.enum(['present', 'absent', 'late']),
});

const scanAttendanceSchema = z.object({
  qrToken: z.string().min(1, 'QR token is required'),
});

module.exports = { createSessionSchema, markAttendanceSchema, scanAttendanceSchema };
