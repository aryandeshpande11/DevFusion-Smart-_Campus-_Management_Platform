const academicService = require('../services/academicService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');
const AppError = require('../utils/appError');

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
  const courses = await academicService.listCourses(req.currentUser);
  return sendSuccess(res, 200, 'Courses fetched', { courses });
});

const listFacultyOptions = catchAsync(async function handleListFacultyOptions(req, res) {
  const faculty = await academicService.listFacultyOptions();
  return sendSuccess(res, 200, 'Faculty fetched', { faculty });
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
  const { course, students } = await academicService.getStudentsInCourse(req.params.id);
  if (!course) throw new AppError('Course not found', 404);

  // a faculty account may only see the roster for a course they're assigned to teach —
  // admins can see any course's roster
  const isFaculty = req.currentUser?.role?.name === 'faculty';
  if (isFaculty && course.facultyId !== req.currentUser.id) {
    throw new AppError("You don't have permission to view this course", 403);
  }

  return sendSuccess(res, 200, 'Students fetched', { students });
});

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