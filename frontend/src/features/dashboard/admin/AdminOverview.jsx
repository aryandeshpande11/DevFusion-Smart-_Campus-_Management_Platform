import React from "react";
import { Users, Building2, Ticket, CalendarCheck, ClipboardCheck } from "lucide-react";
import { StatCard, Card } from "../../../components/common/Card.jsx";
import DonutChart from "../../../components/common/DonutChart.jsx";
import Loader from "../../../components/common/Loader.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { getOverviewStats } from "../../../api/analyticsApi.js";

// admin landing page — headline totals plus a donut-style breakdown of the
// two rate metrics, instead of raw percentage text sitting on its own
export default function AdminOverview() {
  const { data: stats, isLoading } = useFetch(getOverviewStats);

  if (isLoading) return <Loader label="Loading platform stats" />;

  const attendancePercentage = stats?.attendancePercentage ?? 0;
  const assignmentCompletionRate = stats?.assignmentCompletionRate ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total students" value={stats?.totalStudents ?? 0} icon={Users} tone="sky" />
        <StatCard label="Faculty" value={stats?.totalFaculty ?? 0} icon={Users} tone="brand" />
        <StatCard label="Departments" value={stats?.totalDepartments ?? 0} icon={Building2} tone="gold" />
        <StatCard label="Events this term" value={stats?.totalEvents ?? 0} icon={Ticket} tone="rose" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <CalendarCheck size={16} />
            </span>
            <p className="font-medium">Attendance this month</p>
          </div>
          <div className="mt-5 flex justify-center">
            <DonutChart
              segments={[
                { label: "Present", value: attendancePercentage, color: "#1F6F54" },
                { label: "Absent", value: Math.max(0, 100 - attendancePercentage), color: "#E1E4DD" },
              ]}
              centerValue={`${attendancePercentage}%`}
              centerLabel="across departments"
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-gold-600 dark:bg-gold-400/15 dark:text-gold-100">
              <ClipboardCheck size={16} />
            </span>
            <p className="font-medium">Assignment completion</p>
          </div>
          <div className="mt-5 flex justify-center">
            <DonutChart
              segments={[
                { label: "On time", value: assignmentCompletionRate, color: "#C89B3C" },
                { label: "Late / missing", value: Math.max(0, 100 - assignmentCompletionRate), color: "#E1E4DD" },
              ]}
              centerValue={`${assignmentCompletionRate}%`}
              centerLabel="on or before deadline"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
