import React from "react";
import { CalendarCheck } from "lucide-react";
import { PageHeader, DataTable } from "../../../components/common/PageHeader.jsx";
import { StatCard } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { getMonthlyAttendanceReport } from "../../../api/attendanceApi.js";

// campus-wide monthly attendance report, broken down by department
export default function AdminAttendance() {
  const { data: report, isLoading } = useFetch(getMonthlyAttendanceReport);

  if (isLoading) return <Loader label="Loading attendance report" />;

  return (
    <div>
      <PageHeader title="Attendance" description="Monthly attendance percentage by department." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Campus average" value={`${report?.averagePercentage ?? 0}%`} icon={CalendarCheck} />
        <StatCard label="Sessions this month" value={report?.sessionsThisMonth ?? 0} />
        <StatCard label="Departments below 75%" value={report?.departmentsBelowThreshold ?? 0} />
      </div>

      {(!report?.byDepartment || report.byDepartment.length === 0) && (
        <EmptyState icon={CalendarCheck} title="No attendance data yet" description="Reports fill in once faculty start taking sessions." />
      )}

      {report?.byDepartment && report.byDepartment.length > 0 && (
        <DataTable
          columns={[
            { key: "departmentName", label: "Department" },
            { key: "percentage", label: "Attendance %" },
            { key: "sessionsHeld", label: "Sessions held" },
          ]}
          rows={report.byDepartment}
          keyField="departmentName"
        />
      )}
    </div>
  );
}
