import React from "react";
import { Users, Building2, Ticket, CalendarCheck } from "lucide-react";
import { StatCard, Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { getOverviewStats } from "../../../api/analyticsApi.js";

// admin landing page — headline totals plus a quick chart-style breakdown
export default function AdminOverview() {
  const { data: stats, isLoading } = useFetch(getOverviewStats);

  if (isLoading) return <Loader label="Loading platform stats" />;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total students" value={stats?.totalStudents ?? 0} icon={Users} />
        <StatCard label="Faculty" value={stats?.totalFaculty ?? 0} icon={Users} />
        <StatCard label="Departments" value={stats?.totalDepartments ?? 0} icon={Building2} />
        <StatCard label="Events this term" value={stats?.totalEvents ?? 0} icon={Ticket} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <p className="font-medium">Attendance this month</p>
          <p className="mt-2 font-display text-3xl font-semibold">{stats?.attendancePercentage ?? 0}%</p>
          <p className="text-sm text-muted">Across all departments</p>
        </Card>
        <Card>
          <p className="font-medium flex items-center gap-2">
            <CalendarCheck size={16} /> Assignment completion
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">{stats?.assignmentCompletionRate ?? 0}%</p>
          <p className="text-sm text-muted">Submitted on or before deadline</p>
        </Card>
      </div>
    </div>
  );
}
