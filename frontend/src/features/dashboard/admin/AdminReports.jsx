import React from "react";
import { BarChart3, Download } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import Button from "../../../components/common/Button.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { getAttendanceAnalytics, getPlacementAnalytics, getEventAnalytics, exportEntityAsFile } from "../../../api/analyticsApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// campus-wide reports — attendance, placements and event participation,
// with a CSV export action per section
export default function AdminReports() {
  const { data: attendance, isLoading: isLoadingAttendance } = useFetch(getAttendanceAnalytics);
  const { data: placements, isLoading: isLoadingPlacements } = useFetch(getPlacementAnalytics);
  const { data: eventStats, isLoading: isLoadingEvents } = useFetch(getEventAnalytics);
  const { showToast } = useToast();

  const handleExport = async (entityName) => {
    try {
      await exportEntityAsFile(entityName);
      showToast?.("Export ready — check your downloads");
    } catch {
      showToast?.("Couldn't export right now", "error");
    }
  };

  if (isLoadingAttendance || isLoadingPlacements || isLoadingEvents) return <Loader label="Loading reports" />;

  return (
    <div>
      <PageHeader title="Reports" description="Attendance, placement and event trends across campus." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-medium flex items-center gap-2"><BarChart3 size={16} /> Attendance</p>
            <Button size="sm" variant="outline" onClick={() => handleExport("attendance")}>
              <Download size={13} />
            </Button>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold">{attendance?.overallPercentage ?? 0}%</p>
          <p className="text-sm text-muted">Campus-wide this month</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="font-medium">Placements</p>
            <Button size="sm" variant="outline" onClick={() => handleExport("placements")}>
              <Download size={13} />
            </Button>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold">{placements?.studentsPlaced ?? 0}</p>
          <p className="text-sm text-muted">Students placed this year</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="font-medium">Event participation</p>
            <Button size="sm" variant="outline" onClick={() => handleExport("events")}>
              <Download size={13} />
            </Button>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold">{eventStats?.totalRegistrations ?? 0}</p>
          <p className="text-sm text-muted">Registrations this semester</p>
        </Card>
      </div>
    </div>
  );
}
