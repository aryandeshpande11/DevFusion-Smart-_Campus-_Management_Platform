// zod schemas for event creation
const { z } = require('zod');

const createEventSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  description: z.string().optional(),
  venue: z.string().optional(),
  seatsTotal: z.number().int().positive(),
  registrationDeadline: z.string(),
  speakers: z.any().optional(),
});

module.exports = { createEventSchema };
