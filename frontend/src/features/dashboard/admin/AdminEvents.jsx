import React from "react";
import { Ticket, MapPin } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listEvents } from "../../../api/eventApi.js";

// campus-wide view of every event, regardless of which coordinator created it
export default function AdminEvents() {
  const { data: events, isLoading } = useFetch(() => listEvents({}));

  if (isLoading) return <Loader label="Loading events" />;

  return (
    <div>
      <PageHeader title="Events" description="Every event running across departments and clubs." />

      {(!events || events.length === 0) && (
        <EmptyState icon={Ticket} title="No events yet" description="Events created by coordinators will appear here." />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events?.map((event) => (
          <Card key={event.id}>
            <p className="font-medium">{event.title}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={14} /> {event.venue}
            </p>
            <p className="mt-3 text-sm text-muted">{event.seatsFilled}/{event.seatsTotal} seats filled</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
