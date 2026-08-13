import React, { useState } from "react";
import { FileText, Plus } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listCourses } from "../../../api/analyticsApi.js";
import { createAssignment } from "../../../api/assignmentApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// faculty creates assignments here; grading of individual submissions
// happens from the assignment's own detail view once opened
export default function FacultyAssignments() {
  const { data: courses } = useFetch(listCourses);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ courseId: "", title: "", description: "", deadline: "" });
  const [isCreating, setIsCreating] = useState(false);

  const updateField = (fieldName) => (event) =>
    setFormValues((current) => ({ ...current, [fieldName]: event.target.value }));

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      await createAssignment(formValues);
      showToast?.("Assignment created");
      setIsModalOpen(false);
      setFormValues({ courseId: "", title: "", description: "", deadline: "" });
    } catch {
      showToast?.("Couldn't create the assignment", "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Assignments"
        description="Set deadlines and review what students turn in."
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={15} /> New assignment
          </Button>
        }
      />

      <EmptyState
        icon={FileText}
        title="Create your first assignment"
        description="Once posted, students in the course will see it on their dashboard."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New assignment">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <select required className="fieldInput" value={formValues.courseId} onChange={updateField("courseId")}>
            <option value="">Choose a course</option>
            {courses?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <input required placeholder="Title" className="fieldInput" value={formValues.title} onChange={updateField("title")} />
          <textarea
            required
            rows={3}
            placeholder="Description and rubric notes"
            className="fieldInput"
            value={formValues.description}
            onChange={updateField("description")}
          />
          <input
            type="date"
            required
            className="fieldInput"
            value={formValues.deadline}
            onChange={updateField("deadline")}
          />
          <Button type="submit" fullWidth isLoading={isCreating}>
            Create assignment
          </Button>
        </form>
      </Modal>
    </div>
  );
}
