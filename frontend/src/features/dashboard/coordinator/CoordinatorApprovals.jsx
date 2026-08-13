import React, { useState } from "react";
import { UserCheck, Check, X } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listClubs, getClubMembers, decideMembership } from "../../../api/clubApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// pending club-join requests waiting on a coordinator's decision
export default function CoordinatorApprovals() {
  const { data: clubs, isLoading: isLoadingClubs } = useFetch(listClubs);
  const [selectedClubId, setSelectedClubId] = useState("");
  const { data: members, isLoading: isLoadingMembers, reload } = useFetch(
    () => (selectedClubId ? getClubMembers(selectedClubId) : Promise.resolve([])),
    [selectedClubId]
  );
  const { showToast } = useToast();

  const pendingMembers = members?.filter((member) => member.status === "pending") ?? [];

  const handleDecision = async (memberUserId, decision) => {
    try {
      await decideMembership(selectedClubId, memberUserId, decision);
      showToast?.(decision === "approved" ? "Member approved" : "Request rejected");
      reload();
    } catch {
      showToast?.("Couldn't update the request", "error");
    }
  };

  if (isLoadingClubs) return <Loader label="Loading clubs" />;

  return (
    <div>
      <PageHeader title="Approvals" description="Review pending club membership requests." />

      <select
        className="fieldInput mb-6 max-w-xs"
        value={selectedClubId}
        onChange={(event) => setSelectedClubId(event.target.value)}
      >
        <option value="">Choose a club</option>
        {clubs?.map((club) => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </select>

      {selectedClubId && isLoadingMembers && <Loader label="Loading requests" />}

      {selectedClubId && !isLoadingMembers && pendingMembers.length === 0 && (
        <EmptyState icon={UserCheck} title="Nothing pending" description="All caught up — no join requests waiting on you." />
      )}

      <div className="flex flex-col gap-3">
        {pendingMembers.map((member) => (
          <Card key={member.studentId} className="flex items-center justify-between">
            <p className="text-sm font-medium">{member.studentName}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleDecision(member.studentId, "approved")}>
                <Check size={14} /> Approve
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleDecision(member.studentId, "rejected")}>
                <X size={14} /> Reject
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
