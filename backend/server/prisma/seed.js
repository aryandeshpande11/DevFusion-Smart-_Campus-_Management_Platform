// run once after migration to create the base roles every user gets assigned to
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const baseRoles = [
  { name: 'student', permissions: { viewOwnAttendance: true, submitAssignments: true, registerForEvents: true } },
  { name: 'faculty', permissions: { manageAttendance: true, manageAssignments: true, viewCourseReports: true } },
  // combined role: coordinator now carries admin's powers too (manageUsers,
  // manageDepartments, viewAnalytics, exportData) alongside its own
  {
    name: 'coordinator',
    permissions: {
      manageEvents: true,
      manageClubs: true,
      manageUsers: true,
      manageDepartments: true,
      viewAnalytics: true,
      exportData: true,
    },
  },
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


  const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
  if (bootstrapEmail) {
    const coordinatorRole = await prisma.role.findUnique({ where: { name: 'coordinator' } });
    const result = await prisma.user.updateMany({
      where: { email: bootstrapEmail },
      data: { roleId: coordinatorRole.id },
    });
    if (result.count > 0) {
      console.log(`bootstrap: ${bootstrapEmail} moved onto the coordinator role`);
    } else {
      console.log(`bootstrap: no user found with email ${bootstrapEmail}`);
    }
  }
}

seedRoles()
    .catch((error) => console.error(error))
    .finally(() => prisma.$disconnect());