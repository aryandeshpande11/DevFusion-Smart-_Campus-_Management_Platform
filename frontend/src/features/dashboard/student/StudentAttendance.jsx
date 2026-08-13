import React from "react";
import { CalendarCheck } from "lucide-react";
import { PageHeader, DataTable } from "../../../components/common/PageHeader.jsx";
import { StatCard } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Badge from "../../../components/common/Badge.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { getMyAttendanceHistory, getMyAttendanceSummary } from "../../../api/attendanceApi.js";

const statusTone = { present: "success", absent: "danger", late: "warning" };

// student's own attendance — running percentage plus a session-by-session log
export default function StudentAttendance() {
  const { data: summary, isLoading: isLoadingSummary } = useFetch(getMyAttendanceSummary);
  const { data: history, isLoading: isLoadingHistory } = useFetch(getMyAttendanceHistory);

  if (isLoadingSummary || isLoadingHistory) return <Loader label="Loading attendance" />;

  return (
    <div>
      <PageHeader title="Attendance" description="Your subject-wise percentage and session history." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Overall" value={`${summary?.overallPercentage ?? 0}%`} icon={CalendarCheck} />
        <StatCard label="Sessions attended" value={summary?.sessionsAttended ?? 0} />
        <StatCard label="Sessions missed" value={summary?.sessionsMissed ?? 0} />
      </div>

      {(!history || history.length === 0) && (
        <EmptyState icon={CalendarCheck} title="No sessions marked yet" description="Once faculty take attendance, it'll show up here." />
      )}

      {history && history.length > 0 && (
        <DataTable
          columns={[
            { key: "courseName", label: "Course" },
            { key: "date", label: "Date" },
            {
              key: "status",
              label: "Status",
              render: (row) => <Badge tone={statusTone[row.status] || "neutral"}>{row.status}</Badge>,
            },
            { key: "method", label: "Marked via" },
          ]}
          rows={history}
        />
      )}
    </div>
  );
}
