import React, { useState } from "react";
import { ArrowLeft, CalendarCheck, Plus, QrCode, Users } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Badge from "../../../components/common/Badge.jsx";
import Button from "../../../components/common/Button.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listCourses, getStudentsInCourse } from "../../../api/analyticsApi.js";
import { createAttendanceSession, getSessionsForCourse, markStudentPresent } from "../../../api/attendanceApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

const statusOptions = ["present", "absent", "late"];
const statusTone = { present: "success", absent: "danger", late: "warning" };

function nowLocalIso() {
  // trims to minute precision + strips timezone so it drops straight into a
  // <input type="datetime-local"> default value
  const now = new Date();
  now.setSeconds(0, 0);
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

// courses list is already scoped to "just the courses this faculty account
// teaches" by the backend (Course.facultyId), so nothing to filter here
export default function FacultyAttendance() {
  const { data: courses, isLoading } = useFetch(listCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (isLoading) return <Loader label="Loading your courses" />;

  if (selectedCourse) {
    return <CourseSessionPanel course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
      <div>
        <PageHeader title="Attendance" description="Pick a course to take attendance for." />

        {(!courses || courses.length === 0) && (
            <EmptyState
                icon={CalendarCheck}
                title="No courses assigned to you yet"
                description="Once an admin assigns you as faculty for a course, it'll show up here."
            />
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => (
              <button key={course.id} onClick={() => setSelectedCourse(course)} className="text-left">
                <Card className="h-full transition hover:border-brand-500 hover:shadow-md">
                  <p className="font-medium">{course.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {course.code} · Sem {course.semester} · {course.department?.name}
                  </p>
                </Card>
              </button>
          ))}
        </div>
      </div>
  );
}

function CourseSessionPanel({ course, onBack }) {
  const { showToast } = useToast();
  const { data: roster, isLoading: rosterLoading } = useFetch(() => getStudentsInCourse(course.id), [course.id]);
  const {
    data: sessions,
    isLoading: sessionsLoading,
    reload: reloadSessions,
  } = useFetch(() => getSessionsForCourse(course.id), [course.id]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [sessionForm, setSessionForm] = useState({ date: "", startTime: nowLocalIso(), endTime: "", notes: "" });
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [busyKey, setBusyKey] = useState(null); // `${sessionId}:${studentId}` while a mark request is in flight

  const updateField = (fieldName) => (event) =>
      setSessionForm((current) => ({ ...current, [fieldName]: event.target.value }));

  const handleCreateSession = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      const startTime = sessionForm.startTime;
      const date = sessionForm.date || startTime.slice(0, 10);
      await createAttendanceSession({
        courseId: course.id,
        date,
        startTime,
        endTime: sessionForm.endTime || undefined,
        notes: sessionForm.notes || undefined,
      });
      showToast?.("Session started — roster is ready to mark");
      setIsModalOpen(false);
      setSessionForm({ date: "", startTime: nowLocalIso(), endTime: "", notes: "" });
      reloadSessions();
    } catch (error) {
      showToast?.(error?.response?.data?.message || "Couldn't start the session", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleMark = async (sessionId, studentId, status) => {
    setBusyKey(`${sessionId}:${studentId}`);
    try {
      await markStudentPresent(sessionId, studentId, status);
      reloadSessions();
    } catch {
      showToast?.("Couldn't update attendance", "error");
    } finally {
      setBusyKey(null);
    }
  };

  return (
      <div>
        <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink dark:hover:text-canvas">
          <ArrowLeft size={15} /> Back to courses
        </button>

        <PageHeader
            title={course.name}
            description={`${course.code} · Sem ${course.semester} · ${roster?.length ?? 0} students enrolled`}
            action={
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus size={15} /> New session
              </Button>
            }
        />

        {rosterLoading || sessionsLoading ? (
            <Loader label="Loading roster" />
        ) : !roster || roster.length === 0 ? (
            <EmptyState
                icon={Users}
                title="No students in this course's year/sem yet"
                description="Students are matched to a course by department + semester — once students with a matching semester sign up, they'll appear here automatically."
            />
        ) : !sessions || sessions.length === 0 ? (
            <EmptyState
                icon={CalendarCheck}
                title="No sessions yet"
                description="Start a session to begin marking attendance for this course."
            />
        ) : (
            <div className="flex flex-col gap-4">
              {sessions.map((session) => {
                const isExpanded = expandedSessionId === session.id;
                const recordsByStudent = Object.fromEntries((session.records || []).map((r) => [r.studentId, r.status]));
                const presentCount = (session.records || []).filter((r) => r.status !== "absent").length;

                return (
                    <Card key={session.id}>
                      <button
                          className="flex w-full items-center justify-between text-left"
                          onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                      >
                        <div>
                          <p className="font-medium">{new Date(session.date).toLocaleDateString()}</p>
                          <p className="mt-0.5 text-xs text-muted">
                            {new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            {session.endTime &&
                                ` – ${new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                            {" · "}
                            {presentCount}/{roster.length} marked present
                          </p>
                          {session.notes && <p className="mt-1.5 text-sm text-muted">📝 {session.notes}</p>}
                        </div>
                        <Badge tone={session.status === "open" ? "success" : "neutral"}>{session.status}</Badge>
                      </button>

                      {isExpanded && (
                          <div className="mt-4 flex flex-col divide-y divide-border border-t border-border pt-2 dark:divide-white/10 dark:border-white/10">
                            {roster.map((student) => {
                              const currentStatus = recordsByStudent[student.id];
                              return (
                                  <div key={student.id} className="flex items-center justify-between gap-3 py-2.5">
                                    <div>
                                      <p className="text-sm font-medium">{student.name}</p>
                                      <p className="text-xs text-muted">{student.rollNumber || student.email}</p>
                                    </div>
                                    <div className="flex gap-1.5">
                                      {statusOptions.map((status) => {
                                        const isBusy = busyKey === `${session.id}:${student.id}`;
                                        const isActive = currentStatus === status;
                                        return (
                                            <button
                                                key={status}
                                                disabled={isBusy}
                                                onClick={() => handleMark(session.id, student.id, status)}
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize transition disabled:opacity-50 ${
                                                    isActive
                                                        ? statusTone[status] === "success"
                                                            ? "bg-success/10 text-success"
                                                            : statusTone[status] === "danger"
                                                                ? "bg-danger/10 text-danger"
                                                                : "bg-warning/10 text-warning"
                                                        : "bg-black/5 text-muted hover:text-ink dark:bg-white/5 dark:hover:text-canvas"
                                                }`}
                                            >
                                              {status}
                                            </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                              );
                            })}
                          </div>
                      )}
                    </Card>
                );
              })}
            </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Start session · ${course.name}`}>
          <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Starts at</label>
              <input
                  required
                  type="datetime-local"
                  className="fieldInput"
                  value={sessionForm.startTime}
                  onChange={updateField("startTime")}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Ends at (optional)</label>
              <input
                  type="datetime-local"
                  className="fieldInput"
                  value={sessionForm.endTime}
                  onChange={updateField("endTime")}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Notes (optional)</label>
              <textarea
                  rows={3}
                  placeholder="Topics covered, syllabus reference, anything for the record..."
                  className="fieldInput"
                  value={sessionForm.notes}
                  onChange={updateField("notes")}
              />
            </div>
            <p className="flex items-center gap-2 text-xs text-muted">
              <QrCode size={14} /> A scannable QR is generated too, so students can self-mark.
            </p>
            <Button type="submit" fullWidth isLoading={isCreating}>
              Start session
            </Button>
          </form>
        </Modal>
      </div>
  );
}