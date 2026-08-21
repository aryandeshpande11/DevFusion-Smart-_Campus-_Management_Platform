import React, { useState } from "react";
import { GraduationCap, Plus } from "lucide-react";
import { PageHeader, DataTable } from "../../../components/common/PageHeader.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import {
  listCourses,
  createCourse,
  updateCourse,
  listDepartments,
  listFacultyOptions,
} from "../../../api/analyticsApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

const emptyForm = { id: null, name: "", code: "", departmentId: "", semester: "", facultyId: "" };

// course catalogue — each course belongs to one department + semester, and
// (optionally) one faculty member who's the only one allowed to run attendance for it
export default function AdminCourses() {
  const { data: courses, isLoading, reload } = useFetch(listCourses);
  const { data: departments } = useFetch(listDepartments);
  const { data: facultyList } = useFetch(listFacultyOptions);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (fieldName) => (event) =>
      setFormValues((current) => ({ ...current, [fieldName]: event.target.value }));

  const openCreateModal = () => {
    setFormValues(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setFormValues({
      id: course.id,
      name: course.name,
      code: course.code,
      departmentId: course.departmentId,
      semester: String(course.semester),
      facultyId: course.facultyId || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    const payload = {
      name: formValues.name,
      code: formValues.code,
      departmentId: formValues.departmentId,
      semester: Number(formValues.semester),
      facultyId: formValues.facultyId || null,
    };
    try {
      if (formValues.id) {
        await updateCourse(formValues.id, payload);
        showToast?.("Course updated");
      } else {
        await createCourse(payload);
        showToast?.("Course added");
      }
      setIsModalOpen(false);
      setFormValues(emptyForm);
      reload();
    } catch (error) {
      showToast?.(error?.response?.data?.message || "Couldn't save the course", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loader label="Loading courses" />;

  return (
      <div>
        <PageHeader
            title="Courses"
            description="The full course catalogue across departments."
            action={
              <Button size="sm" onClick={openCreateModal}>
                <Plus size={15} /> New course
              </Button>
            }
        />

        {(!courses || courses.length === 0) && (
            <EmptyState icon={GraduationCap} title="No courses yet" description="Add a course to start scheduling attendance and assignments." />
        )}

        {courses && courses.length > 0 && (
            <DataTable
                columns={[
                  { key: "name", label: "Course" },
                  { key: "code", label: "Code" },
                  { key: "department", label: "Department", render: (row) => row.department?.name || "—" },
                  { key: "semester", label: "Semester" },
                  {
                    key: "faculty",
                    label: "Faculty",
                    render: (row) =>
                        row.faculty ? row.faculty.name : <span className="text-muted">Unassigned</span>,
                  },
                  {
                    key: "actions",
                    label: "",
                    render: (row) => (
                        <Button size="sm" variant="outline" onClick={() => openEditModal(row)}>
                          Edit
                        </Button>
                    ),
                  },
                ]}
                rows={courses}
            />
        )}

        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={formValues.id ? "Edit course" : "Add course"}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input required placeholder="Course name" className="fieldInput" value={formValues.name} onChange={updateField("name")} />
            <input required placeholder="Course code" className="fieldInput" value={formValues.code} onChange={updateField("code")} />
            <select required className="fieldInput" value={formValues.departmentId} onChange={updateField("departmentId")}>
              <option value="">Choose department</option>
              {departments?.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
              ))}
            </select>
            <input
                required
                type="number"
                placeholder="Semester"
                className="fieldInput"
                value={formValues.semester}
                onChange={updateField("semester")}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium">Faculty</label>
              <select className="fieldInput" value={formValues.facultyId} onChange={updateField("facultyId")}>
                <option value="">Unassigned</option>
                {facultyList?.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name} ({faculty.email})
                    </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-muted">
                Only this faculty member will be able to start attendance sessions for this course.
              </p>
            </div>
            <Button type="submit" fullWidth isLoading={isSaving}>
              {formValues.id ? "Save changes" : "Add course"}
            </Button>
          </form>
        </Modal>
      </div>
  );
}