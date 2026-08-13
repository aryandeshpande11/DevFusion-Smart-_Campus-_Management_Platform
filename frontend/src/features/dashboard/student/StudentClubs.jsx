import React, { useState } from "react";
import { Users } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import Badge from "../../../components/common/Badge.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listClubs, joinClub } from "../../../api/clubApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

const membershipTone = { pending: "warning", approved: "success", rejected: "danger" };

// clubs the student can browse and request to join
export default function StudentClubs() {
  const { data: clubs, isLoading, reload } = useFetch(listClubs);
  const { showToast } = useToast();
  const [joiningId, setJoiningId] = useState(null);

  const handleJoin = async (clubId) => {
    setJoiningId(clubId);
    try {
      await joinClub(clubId);
      showToast?.("Join request sent");
      reload();
    } catch {
      showToast?.("Couldn't send the request", "error");
    } finally {
      setJoiningId(null);
    }
  };

  if (isLoading) return <Loader label="Loading clubs" />;

  return (
    <div>
      <PageHeader title="Clubs" description="Find your people — request to join a club." />

      {(!clubs || clubs.length === 0) && (
        <EmptyState icon={Users} title="No clubs registered yet" description="Clubs set up by coordinators will show up here." />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {clubs?.map((club) => (
          <Card key={club.id}>
            <p className="font-medium">{club.name}</p>
            <p className="mt-1 text-sm text-muted">{club.description}</p>
            {club.membershipStatus ? (
              <Badge tone={membershipTone[club.membershipStatus] || "neutral"} className="mt-4">
                {club.membershipStatus}
              </Badge>
            ) : (
              <Button
                size="sm"
                className="mt-4"
                isLoading={joiningId === club.id}
                onClick={() => handleJoin(club.id)}
              >
                Request to join
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
