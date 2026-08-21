// business logic for departments and courses - mostly simple crud used to set up the academic structure
const db = require('../config/db');

async function createDepartment({ name, code }) {
  return db.department.create({ data: { name, code } });
}

async function listDepartments() {
  return db.department.findMany({ orderBy: { name: 'asc' } });
}

async function updateDepartment(departmentId, updates) {
  return db.department.update({ where: { id: departmentId }, data: updates });
}

async function deleteDepartment(departmentId) {
  await db.department.delete({ where: { id: departmentId } });
}

async function createCourse({ name, code, departmentId, semester, facultyId }) {
  return db.course.create({ data: { name, code, departmentId, semester, facultyId: facultyId || null } });
}

// admin/coordinator sees every course; faculty only see courses they're assigned to teach
async function listCourses(currentUser) {
  const where = currentUser?.role?.name === 'faculty' ? { facultyId: currentUser.id } : {};
  return db.course.findMany({ where, include: { department: true, faculty: true }, orderBy: { name: 'asc' } });
}

async function listFacultyOptions() {
  return db.user.findMany({
    where: { role: { name: 'faculty' } },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });
}

async function updateCourse(courseId, updates) {
  return db.course.update({ where: { id: courseId }, data: updates });
}

async function deleteCourse(courseId) {
  await db.course.delete({ where: { id: courseId } });
}

// students enrolled in a course inferred from matching department + semester
async function getStudentsInCourse(courseId) {
  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) return { course: null, students: [] };

  const students = await db.user.findMany({
    where: { departmentId: course.departmentId, semester: course.semester, role: { name: 'student' } },
    orderBy: { name: 'asc' },
  });
  return { course, students };
}

module.exports = {
  createDepartment,
  listDepartments,
  updateDepartment,
  deleteDepartment,
  createCourse,
  listCourses,
  listFacultyOptions,
  updateCourse,
  deleteCourse,
  getStudentsInCourse,
};