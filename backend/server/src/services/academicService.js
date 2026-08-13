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

async function createCourse({ name, code, departmentId, semester }) {
  return db.course.create({ data: { name, code, departmentId, semester } });
}

async function listCourses() {
  return db.course.findMany({ include: { department: true }, orderBy: { name: 'asc' } });
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
  if (!course) return [];

  return db.user.findMany({
    where: { departmentId: course.departmentId, semester: course.semester, role: { name: 'student' } },
  });
}

module.exports = {
  createDepartment,
  listDepartments,
  updateDepartment,
  deleteDepartment,
  createCourse,
  listCourses,
  updateCourse,
  deleteCourse,
  getStudentsInCourse,
};
