const academicService = require('../services/academicService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');

const createDepartment = catchAsync(async function handleCreateDepartment(req, res) {
  const department = await academicService.createDepartment(req.body);
  return sendSuccess(res, 201, 'Department created', { department });
});

const listDepartments = catchAsync(async function handleListDepartments(req, res) {
  const departments = await academicService.listDepartments();
  return sendSuccess(res, 200, 'Departments fetched', { departments });
});

const updateDepartment = catchAsync(async function handleUpdateDepartment(req, res) {
  const department = await academicService.updateDepartment(req.params.id, req.body);
  return sendSuccess(res, 200, 'Department updated', { department });
});

const deleteDepartment = catchAsync(async function handleDeleteDepartment(req, res) {
  await academicService.deleteDepartment(req.params.id);
  return sendSuccess(res, 200, 'Department deleted');
});

const createCourse = catchAsync(async function handleCreateCourse(req, res) {
  const course = await academicService.createCourse(req.body);
  return sendSuccess(res, 201, 'Course created', { course });
});

const listCourses = catchAsync(async function handleListCourses(req, res) {
  const courses = await academicService.listCourses();
  return sendSuccess(res, 200, 'Courses fetched', { courses });
});

const updateCourse = catchAsync(async function handleUpdateCourse(req, res) {
  const course = await academicService.updateCourse(req.params.id, req.body);
  return sendSuccess(res, 200, 'Course updated', { course });
});

const deleteCourse = catchAsync(async function handleDeleteCourse(req, res) {
  await academicService.deleteCourse(req.params.id);
  return sendSuccess(res, 200, 'Course deleted');
});

const getStudentsInCourse = catchAsync(async function handleGetStudentsInCourse(req, res) {
  const students = await academicService.getStudentsInCourse(req.params.id);
  return sendSuccess(res, 200, 'Students fetched', { students });
});

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
