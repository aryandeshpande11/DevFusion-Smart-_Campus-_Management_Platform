import React, { useState } from "react";
import { CalendarCheck, Plus, QrCode } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listCourses } from "../../../api/analyticsApi.js";
import { createAttendanceSession } from "../../../api/attendanceApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// faculty creates a session per course, which generates the QR
// students scan to self-mark (per the auth/attendance design)
export default function FacultyAttendance() {
  const { data: courses, isLoading } = useFetch(listCourses);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSession = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      await createAttendanceSession({ courseId: selectedCourseId });
      showToast?.("Session started — QR is live");
      setIsModalOpen(false);
    } catch {
      showToast?.("Couldn't start the session", "error");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <Loader label="Loading courses" />;

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Start a session and let students self-mark by QR."
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={15} /> New session
          </Button>
        }
      />

      {(!courses || courses.length === 0) && (
        <EmptyState icon={CalendarCheck} title="No courses to take attendance for" description="Once you're assigned a course, sessions will start here." />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <Card key={course.id}>
            <p className="font-medium">{course.name}</p>
            <p className="mt-1 text-sm text-muted">{course.code}</p>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Start attendance session">
        <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
          <select
            required
            className="fieldInput"
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
          >
            <option value="">Choose a course</option>
            {courses?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <p className="flex items-center gap-2 text-xs text-muted">
            <QrCode size={14} /> A scannable QR is generated once the session starts.
          </p>
          <Button type="submit" fullWidth isLoading={isCreating}>
            Start session
          </Button>
        </form>
      </Modal>
    </div>
  );
}
