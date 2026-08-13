// zod schemas for creating assignments and reviewing submissions
const { z } = require('zod');

const createAssignmentSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(2, 'Title is too short'),
  description: z.string().optional(),
  deadline: z.string(),
  rubric: z.any().optional(),
});

const reviewSubmissionSchema = z.object({
  marks: z.number().min(0),
  feedback: z.string().optional(),
});

module.exports = { createAssignmentSchema, reviewSubmissionSchema };
