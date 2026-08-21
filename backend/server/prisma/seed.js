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
    .then(seedDemoData)
    .catch((error) => console.error(error))
    .finally(() => prisma.$disconnect());

// --- demo/showcase data -----------------------------------------------
// realistic-looking departments, courses, events, clubs, placements and
// notices so the app doesn't look empty for evaluators. Safe to re-run:
// every insert is guarded by a findFirst/upsert check first.
async function seedDemoData() {
  const departments = [
    { name: 'Computer Science and Engineering', code: 'CSE' },
    { name: 'Artificial Intelligence and Machine Learning', code: 'AIML' },
    { name: 'Information Technology', code: 'IT' },
    { name: 'Electronics and Communication Engineering', code: 'ECE' },
    { name: 'Mechanical Engineering', code: 'MECH' },
  ];

  const deptByCode = {};
  for (const dept of departments) {
    deptByCode[dept.code] = await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name },
      create: dept,
    });
  }
  console.log('departments seeded');

  const courses = [
    { code: 'TOC', name: 'Theory of Computation', dept: 'CSE', semester: 5 },
    { code: 'OS', name: 'Operating Systems', dept: 'CSE', semester: 4 },
    { code: 'DBMS', name: 'Database Management Systems', dept: 'CSE', semester: 5 },
    { code: 'CN', name: 'Computer Networks', dept: 'CSE', semester: 6 },
    { code: 'DSA', name: 'Data Structures and Algorithms', dept: 'CSE', semester: 3 },
    { code: 'CD', name: 'Compiler Design', dept: 'CSE', semester: 6 },
    { code: 'ML', name: 'Machine Learning Fundamentals', dept: 'AIML', semester: 5 },
    { code: 'DL', name: 'Deep Learning', dept: 'AIML', semester: 6 },
    { code: 'NLP', name: 'Natural Language Processing', dept: 'AIML', semester: 7 },
    { code: 'NPTEL-RL', name: 'NPTEL: Reinforcement Learning', dept: 'AIML', semester: 6 },
    { code: 'DEVOPS', name: 'DevOps and Cloud Computing', dept: 'IT', semester: 6 },
    { code: 'WT', name: 'Web Technologies', dept: 'IT', semester: 4 },
    { code: 'INFOSEC', name: 'Information Security', dept: 'IT', semester: 6 },
    { code: 'DSP', name: 'Digital Signal Processing', dept: 'ECE', semester: 5 },
    { code: 'VLSI', name: 'VLSI Design', dept: 'ECE', semester: 6 },
    { code: 'THERMO', name: 'Thermodynamics', dept: 'MECH', semester: 3 },
  ];

  for (const course of courses) {
    const departmentId = deptByCode[course.dept].id;
    const exists = await prisma.course.findFirst({ where: { code: course.code, departmentId } });
    if (!exists) {
      await prisma.course.create({
        data: { name: course.name, code: course.code, departmentId, semester: course.semester },
      });
    }
  }
  console.log('courses seeded');

  // creator-owned records (events/clubs/placements/notices) need a real
  // user id — prefer the bootstrap admin, fall back to any coordinator
  const creator =
      (process.env.BOOTSTRAP_ADMIN_EMAIL &&
          (await prisma.user.findUnique({ where: { email: process.env.BOOTSTRAP_ADMIN_EMAIL } }))) ||
      (await prisma.user.findFirst({ where: { role: { name: 'coordinator' } } }));

  if (!creator) {
    console.log('demo data: no coordinator account found yet, skipping events/clubs/placements/notices');
    return;
  }

  const inDays = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

  const events = [
    { title: 'Orientation Day 2026', description: 'Welcome session for new students across all departments.', venue: 'Main Auditorium', seatsTotal: 500, registrationDeadline: inDays(5) },
    { title: 'DevFusion Hackathon 4.0', description: '24-hour build sprint across web, AI/ML and systems tracks.', venue: 'Innovation Lab', seatsTotal: 150, registrationDeadline: inDays(14) },
    { title: 'AI/ML Workshop: Building with Transformers', description: 'Hands-on session on transformer architectures and fine-tuning.', venue: 'Seminar Hall 2', seatsTotal: 100, registrationDeadline: inDays(10) },
    { title: 'Placement Prep Bootcamp', description: 'Resume reviews, mock interviews and aptitude prep.', venue: 'Career Cell Room', seatsTotal: 80, registrationDeadline: inDays(7) },
    { title: 'Tech Talk: Cloud-Native DevOps', description: 'Industry speaker session on CI/CD and Kubernetes in production.', venue: 'Seminar Hall 1', seatsTotal: 120, registrationDeadline: inDays(12) },
    { title: 'Annual Cultural Fest — Aurora', description: 'Music, dance and art competitions across the campus.', venue: 'Open Air Theatre', seatsTotal: 1000, registrationDeadline: inDays(20) },
  ];

  for (const event of events) {
    const exists = await prisma.event.findFirst({ where: { title: event.title } });
    if (!exists) {
      await prisma.event.create({ data: { ...event, createdBy: creator.id, status: 'upcoming' } });
    }
  }
  console.log('events seeded');

  const clubs = [
    { name: 'Coding Club', description: 'Competitive programming and open-source contributions.' },
    { name: 'AI/ML Research Club', description: 'Reading groups and applied ML project teams.' },
    { name: 'Robotics Club', description: 'Autonomous bots, embedded systems and robotics competitions.' },
    { name: 'Entrepreneurship Cell', description: 'Startup pitches, mentorship and campus incubation.' },
  ];

  for (const club of clubs) {
    const exists = await prisma.club.findFirst({ where: { name: club.name } });
    if (!exists) {
      await prisma.club.create({ data: { ...club, coordinatorId: creator.id } });
    }
  }
  console.log('clubs seeded');

  const placements = [
    { companyName: 'Google', jobRole: 'Software Engineer Intern', ctc: '₹40 LPA', deadline: inDays(15), description: 'Summer internship for pre-final year students.', eligibility: { minCgpa: 8.0, branches: ['CSE', 'AIML', 'IT'] } },
    { companyName: 'Microsoft', jobRole: 'SDE-1', ctc: '₹32 LPA', deadline: inDays(18), description: 'Full-time role for final year students.', eligibility: { minCgpa: 7.5, branches: ['CSE', 'AIML', 'IT', 'ECE'] } },
    { companyName: 'Amazon', jobRole: 'SDE Intern', ctc: '₹22 LPA', deadline: inDays(10), description: 'Internship with pre-placement offer track.', eligibility: { minCgpa: 7.0, branches: ['CSE', 'AIML', 'IT'] } },
    { companyName: 'TCS', jobRole: 'Systems Engineer', ctc: '₹7 LPA', deadline: inDays(20), description: 'Mass recruitment drive, all branches welcome.', eligibility: { minCgpa: 6.0, branches: ['CSE', 'AIML', 'IT', 'ECE', 'MECH'] } },
    { companyName: 'Infosys', jobRole: 'Digital Specialist Engineer', ctc: '₹9.5 LPA', deadline: inDays(22), description: 'Role focused on cloud and digital transformation projects.', eligibility: { minCgpa: 6.5, branches: ['CSE', 'IT', 'ECE'] } },
  ];

  for (const placement of placements) {
    const exists = await prisma.placement.findFirst({ where: { companyName: placement.companyName, jobRole: placement.jobRole } });
    if (!exists) {
      await prisma.placement.create({ data: { ...placement, createdBy: creator.id } });
    }
  }
  console.log('placements seeded');

  const notices = [
    { title: 'Semester End Exam Schedule Released', content: 'The end-semester examination timetable has been published on the notice board and portal.', targetRole: null, targetDepartment: null },
    { title: 'NPTEL Enrollment Deadline Extended', content: 'Students can now enroll for NPTEL certification courses until the end of this week.', targetRole: 'student', targetDepartment: null },
    { title: 'Campus Placement Drive — Google & Microsoft', content: 'Eligible final and pre-final year students should register on the placements tab before the deadline.', targetRole: 'student', targetDepartment: null },
    { title: 'Diwali Holiday Notice', content: 'The campus will remain closed for the Diwali break; classes resume the following Monday.', targetRole: null, targetDepartment: null },
  ];

  for (const notice of notices) {
    const exists = await prisma.notice.findFirst({ where: { title: notice.title } });
    if (!exists) {
      await prisma.notice.create({ data: { ...notice, createdBy: creator.id } });
    }
  }
  console.log('notices seeded');
}