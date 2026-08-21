// zod schemas that guard every auth route input before it touches the service layer
const { z } = require('zod');

const signupSchema = z
    .object({
      name: z.string().min(2, 'Name is too short'),
      email: z.string().email('Enter a valid email'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      // admin accounts are provisioned separately, never through public signup
      role: z.enum(['student', 'faculty', 'coordinator']).optional(),
      // department applies to students and faculty; semester only makes sense for students
      // (coordinators aren't tied to a single department/semester roster)
      departmentId: z.string().uuid('Select a valid department').optional(),
      semester: z.coerce.number().int().min(1, 'Semester must be between 1 and 12').max(12, 'Semester must be between 1 and 12').optional(),
    })
    .superRefine((values, ctx) => {
      const role = values.role || 'student';
      if (role === 'student' && !values.departmentId) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['departmentId'], message: 'Department is required for students' });
      }
      if (role === 'student' && !values.semester) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['semester'], message: 'Semester is required for students' });
      }
    });

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
};