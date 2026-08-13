import React from "react";
import { BookOpen, CalendarCheck, FileText, Users } from "lucide-react";
import { StatCard, Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { getMonthlyAttendanceReport } from "../../../api/attendanceApi.js";

// faculty landing page — class load, attendance rate and a submissions feed
export default function FacultyOverview() {
  const { data: report, isLoading } = useFetch(getMonthlyAttendanceReport);

  if (isLoading) return <Loader label="Loading your dashboard" />;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Classes today" value={report?.classesToday ?? 0} icon={BookOpen} />
        <StatCard label="Avg. attendance" value={`${report?.averagePercentage ?? 0}%`} icon={CalendarCheck} />
        <StatCard label="Assignments open" value={report?.openAssignments ?? 0} icon={FileText} />
        <StatCard label="Students taught" value={report?.studentCount ?? 0} icon={Users} />
      </div>

      <Card>
        <p className="font-medium">Recent submissions</p>
        <div className="mt-4 flex flex-col gap-3">
          {(report?.recentSubmissions ?? []).map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 dark:border-white/10"
            >
              <div>
                <p className="text-sm font-medium">{submission.studentName}</p>
                <p className="text-xs text-muted">{submission.assignmentTitle}</p>
              </div>
              <span className="text-xs text-muted">{submission.submittedAt}</span>
            </div>
          ))}
          {(!report?.recentSubmissions || report.recentSubmissions.length === 0) && (
            <p className="text-sm text-muted">No submissions to review yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
