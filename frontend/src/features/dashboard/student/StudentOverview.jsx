import React from "react";
import { CalendarCheck, FileText, Ticket, Briefcase } from "lucide-react";
import { StatCard } from "../../../components/common/Card.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import Badge from "../../../components/common/Badge.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { getMyAttendanceSummary } from "../../../api/attendanceApi.js";
import { getMySubmissions } from "../../../api/assignmentApi.js";
import { listEvents } from "../../../api/eventApi.js";
import { listNotices } from "../../../api/noticeApi.js";

// landing page after login for a student — quick counts up top, a
// subject-wise attendance breakdown, and what's coming up next
export default function StudentOverview() {
  const { data: attendanceSummary, isLoading: isLoadingAttendance } = useFetch(getMyAttendanceSummary);
  const { data: submissions, isLoading: isLoadingSubmissions } = useFetch(getMySubmissions);
  const { data: upcomingEvents, isLoading: isLoadingEvents } = useFetch(() => listEvents({ upcoming: true }));
  const { data: notices, isLoading: isLoadingNotices } = useFetch(listNotices);

  const isPageLoading = isLoadingAttendance && isLoadingSubmissions && isLoadingEvents && isLoadingNotices;

  if (isPageLoading) return <Loader label="Loading your dashboard" />;

  const pendingAssignments = submissions?.filter((item) => item.status === "pending").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Overall attendance"
          value={`${attendanceSummary?.overallPercentage ?? 0}%`}
          icon={CalendarCheck}
        />
        <StatCard label="Assignments due" value={pendingAssignments} icon={FileText} />
        <StatCard label="Events open" value={upcomingEvents?.length ?? 0} icon={Ticket} />
        <StatCard label="Placement drives" value={0} icon={Briefcase} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="font-medium">Subject-wise attendance</p>
          <div className="mt-4 flex flex-col gap-3">
            {(attendanceSummary?.subjects ?? []).map((subject) => (
              <div key={subject.courseName}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{subject.courseName}</span>
                  <span className="text-muted">{subject.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/5 dark:bg-white/10">
                  <div
                    className="h-2 rounded-full bg-brand-500"
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {(!attendanceSummary?.subjects || attendanceSummary.subjects.length === 0) && (
              <p className="text-sm text-muted">Attendance data will appear once sessions are marked.</p>
            )}
          </div>
        </Card>

        <Card>
          <p className="font-medium">Latest notices</p>
          <div className="mt-4 flex flex-col gap-3">
            {notices?.slice(0, 4).map((notice) => (
              <div key={notice.id} className="border-b border-border pb-3 last:border-0 dark:border-white/10">
                <p className="text-sm font-medium">{notice.title}</p>
                <Badge tone="brand">{notice.targetRole || "all"}</Badge>
              </div>
            ))}
            {(!notices || notices.length === 0) && (
              <p className="text-sm text-muted">Nothing posted yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
