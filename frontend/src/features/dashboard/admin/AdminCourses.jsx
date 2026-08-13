import React, { useState } from "react";
import { GraduationCap, Plus } from "lucide-react";
import { PageHeader, DataTable } from "../../../components/common/PageHeader.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listCourses, createCourse, listDepartments } from "../../../api/analyticsApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// course catalogue — each course belongs to one department and semester
export default function AdminCourses() {
  const { data: courses, isLoading, reload } = useFetch(listCourses);
  const { data: departments } = useFetch(listDepartments);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", code: "", departmentId: "", semester: "" });
  const [isCreating, setIsCreating] = useState(false);

  const updateField = (fieldName) => (event) =>
    setFormValues((current) => ({ ...current, [fieldName]: event.target.value }));

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      await createCourse(formValues);
      showToast?.("Course added");
      setIsModalOpen(false);
      setFormValues({ name: "", code: "", departmentId: "", semester: "" });
      reload();
    } catch {
      showToast?.("Couldn't add the course", "error");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <Loader label="Loading courses" />;

  return (
    <div>
      <PageHeader
        title="Courses"
        description="The full course catalogue across departments."
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
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
            { key: "departmentName", label: "Department" },
            { key: "semester", label: "Semester" },
          ]}
          rows={courses}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add course">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
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
          <Button type="submit" fullWidth isLoading={isCreating}>
            Add course
          </Button>
        </form>
      </Modal>
    </div>
  );
}
