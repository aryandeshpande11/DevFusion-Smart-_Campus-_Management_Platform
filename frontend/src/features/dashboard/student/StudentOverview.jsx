import React from "react";
import { CalendarCheck, FileText, Ticket, Briefcase, ClipboardList, Megaphone } from "lucide-react";
import { StatCard, Card, MetricPanel } from "../../../components/common/Card.jsx";
import AreaChart from "../../../components/common/AreaChart.jsx";
import DonutChart from "../../../components/common/DonutChart.jsx";
import Loader from "../../../components/common/Loader.jsx";
import Badge from "../../../components/common/Badge.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { getMyAttendanceSummary } from "../../../api/attendanceApi.js";
import { getMySubmissions } from "../../../api/assignmentApi.js";
import { listEvents } from "../../../api/eventApi.js";
import { listNotices } from "../../../api/noticeApi.js";

// palette cycled across whatever assignment statuses actually come back —
// keeps the donut legend in step with the app's brand colors instead of
// hard-coded rainbow chart-library defaults
const STATUS_COLORS = ["#FDBA4C", "#3E7C97", "#2563EB", "#B65C4E", "#4A5568"];
const STATUS_LABELS = {
  pending: "Pending",
  submitted: "Submitted",
  graded: "Graded",
  late: "Late",
};

function toTitleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// landing page after login for a student — quick counts up top, an
// attendance-by-subject chart, and what's coming up next
export default function StudentOverview() {
  const { data: attendanceSummary, isLoading: isLoadingAttendance } = useFetch(getMyAttendanceSummary);
  const { data: submissions, isLoading: isLoadingSubmissions } = useFetch(getMySubmissions);
  const { data: upcomingEvents, isLoading: isLoadingEvents } = useFetch(() => listEvents({ upcoming: true }));
  const { data: notices, isLoading: isLoadingNotices } = useFetch(listNotices);

  const isPageLoading = isLoadingAttendance && isLoadingSubmissions && isLoadingEvents && isLoadingNotices;

  if (isPageLoading) return <Loader label="Loading your dashboard" />;

  const pendingAssignments = submissions?.filter((item) => item.status === "pending").length ?? 0;
  const subjects = attendanceSummary?.subjects ?? [];

  const chartData = subjects.map((subject) => ({
    label: subject.courseName.length > 10 ? `${subject.courseName.slice(0, 9)}…` : subject.courseName,
    value: subject.percentage,
  }));

  const statusCounts = (submissions ?? []).reduce((counts, submission) => {
    const key = submission.status || "other";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
  const statusSegments = Object.entries(statusCounts).map(([status, count], index) => ({
    label: STATUS_LABELS[status] || toTitleCase(status),
    value: count,
    color: STATUS_COLORS[index % STATUS_COLORS.length],
  }));
  const totalSubmissions = submissions?.length ?? 0;

  return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
              label="Overall attendance"
              value={`${attendanceSummary?.overallPercentage ?? 0}%`}
              icon={CalendarCheck}
              tone="sky"
          />
          <StatCard label="Assignments due" value={pendingAssignments} icon={FileText} tone="rose" />
          <StatCard label="Events open" value={upcomingEvents?.length ?? 0} icon={Ticket} tone="gold" />
          <StatCard label="Placement drives" value={0} icon={Briefcase} tone="brand" />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-100">
                <CalendarCheck size={16} />
              </span>
                <p className="font-medium">Attendance by subject</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="sm:col-span-2">
                {chartData.length > 0 ? (
                    <AreaChart data={chartData} accentColor="#3E7C97" accentColorEnd="#2563EB" formatValue={(v) => `${v}%`} />
                ) : (
                    <p className="py-16 text-center text-sm text-muted">
                      Attendance data will appear once sessions are marked.
                    </p>
                )}
              </div>
              <div className="flex flex-col gap-4 divide-y divide-border sm:pl-2 dark:divide-white/10">
                <MetricPanel
                    label="Overall attendance"
                    value={`${attendanceSummary?.overallPercentage ?? 0}%`}
                    caption="across enrolled subjects"
                />
                <div className="pt-4">
                  <MetricPanel
                      label="Assignments due"
                      value={pendingAssignments}
                      caption="pending this term"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-100">
              <ClipboardList size={16} />
            </span>
              <p className="font-medium">Assignment status</p>
            </div>

            <div className="mt-5 flex justify-center">
              {statusSegments.length > 0 ? (
                  <DonutChart segments={statusSegments} centerValue={totalSubmissions} centerLabel="submissions" />
              ) : (
                  <p className="py-10 text-center text-sm text-muted">No submissions yet.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-gold-600 dark:bg-gold-400/15 dark:text-gold-100">
              <Ticket size={16} />
            </span>
              <p className="font-medium">Upcoming events</p>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {upcomingEvents?.slice(0, 5).map((event) => (
                  <div
                      key={event.id}
                      className="flex items-center justify-between border-b border-border pb-3 last:border-0 dark:border-white/10"
                  >
                    <span className="text-sm">{event.title}</span>
                    <span className="text-xs text-muted">
                  {event.seatsFilled}/{event.seatsTotal} registered
                </span>
                  </div>
              ))}
              {(!upcomingEvents || upcomingEvents.length === 0) && (
                  <p className="text-sm text-muted">Nothing on the calendar right now.</p>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <Megaphone size={16} />
            </span>
              <p className="font-medium">Latest notices</p>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {notices?.slice(0, 4).map((notice) => (
                  <div key={notice.id} className="border-b border-border pb-3 last:border-0 dark:border-white/10">
                    <p className="text-sm font-medium">{notice.title}</p>
                    <Badge tone="brand">{notice.targetRole || "all"}</Badge>
                  </div>
              ))}
              {(!notices || notices.length === 0) && <p className="text-sm text-muted">Nothing posted yet.</p>}
            </div>
          </Card>
        </div>
      </div>
  );
}