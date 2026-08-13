// run once after migration to create the base roles every user gets assigned to
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const baseRoles = [
  { name: 'student', permissions: { viewOwnAttendance: true, submitAssignments: true, registerForEvents: true } },
  { name: 'faculty', permissions: { manageAttendance: true, manageAssignments: true, viewCourseReports: true } },
  { name: 'coordinator', permissions: { manageEvents: true, manageClubs: true } },
  { name: 'admin', permissions: { manageUsers: true, manageDepartments: true, viewAnalytics: true, exportData: true } },
];

async function seedRoles() {
  for (const role of baseRoles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { permissions: role.permissions },
      create: role,
    });
  }
  console.log('roles seeded');
}

seedRoles()
  .catch((error) => console.error(error))
  .finally(() => prisma.$disconnect());
