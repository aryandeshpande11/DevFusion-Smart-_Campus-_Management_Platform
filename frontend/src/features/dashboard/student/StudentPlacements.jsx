import React, { useState } from "react";
import { Briefcase, IndianRupee } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import Badge from "../../../components/common/Badge.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listPlacementPostings, applyToPlacement } from "../../../api/placementApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

const statusTone = { applied: "neutral", shortlisted: "warning", selected: "success", rejected: "danger" };

// placement drives the student can apply to, with a live application status
export default function StudentPlacements() {
  const { data: placements, isLoading, reload } = useFetch(listPlacementPostings);
  const { showToast } = useToast();
  const [applyingId, setApplyingId] = useState(null);

  const handleApply = async (placementId) => {
    setApplyingId(placementId);
    try {
      await applyToPlacement(placementId, {});
      showToast?.("Application submitted");
      reload();
    } catch {
      showToast?.("Couldn't submit your application", "error");
    } finally {
      setApplyingId(null);
    }
  };

  if (isLoading) return <Loader label="Loading placements" />;

  return (
    <div>
      <PageHeader title="Placements" description="Open drives and where your applications stand." />

      {(!placements || placements.length === 0) && (
        <EmptyState icon={Briefcase} title="No drives posted yet" description="New placement postings will appear here." />
      )}

      <div className="flex flex-col gap-3">
        {placements?.map((placement) => (
          <Card key={placement.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{placement.companyName} — {placement.jobRole}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                <IndianRupee size={13} /> {placement.ctc} · Apply by {placement.deadline}
              </p>
            </div>
            {placement.applicationStatus ? (
              <Badge tone={statusTone[placement.applicationStatus] || "neutral"}>
                {placement.applicationStatus}
              </Badge>
            ) : (
              <Button size="sm" isLoading={applyingId === placement.id} onClick={() => handleApply(placement.id)}>
                Apply
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
