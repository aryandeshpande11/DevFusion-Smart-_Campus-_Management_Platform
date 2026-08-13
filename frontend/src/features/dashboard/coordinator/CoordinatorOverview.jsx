import React from "react";
import { Ticket, Users, UserCheck, Megaphone } from "lucide-react";
import { StatCard, Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listEvents } from "../../../api/eventApi.js";
import { listClubs } from "../../../api/clubApi.js";

// coordinator landing page — events run, clubs managed, pending approvals
export default function CoordinatorOverview() {
  const { data: events, isLoading: isLoadingEvents } = useFetch(() => listEvents({}));
  const { data: clubs, isLoading: isLoadingClubs } = useFetch(listClubs);

  if (isLoadingEvents || isLoadingClubs) return <Loader label="Loading your dashboard" />;

  const pendingApprovals = clubs?.reduce((total, club) => total + (club.pendingCount || 0), 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Events managed" value={events?.length ?? 0} icon={Ticket} />
        <StatCard label="Clubs active" value={clubs?.length ?? 0} icon={Users} />
        <StatCard label="Pending approvals" value={pendingApprovals} icon={UserCheck} />
        <StatCard label="Notices sent" value={0} icon={Megaphone} />
      </div>

      <Card>
        <p className="font-medium">Upcoming events</p>
        <div className="mt-4 flex flex-col gap-3">
          {events?.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 dark:border-white/10">
              <span className="text-sm">{event.title}</span>
              <span className="text-xs text-muted">{event.seatsFilled}/{event.seatsTotal} registered</span>
            </div>
          ))}
          {(!events || events.length === 0) && <p className="text-sm text-muted">No events created yet.</p>}
        </div>
      </Card>
    </div>
  );
}
