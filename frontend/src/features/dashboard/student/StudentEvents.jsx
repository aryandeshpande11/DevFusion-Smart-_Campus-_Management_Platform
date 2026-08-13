import React, { useState } from "react";
import { Ticket, MapPin, Users as UsersIcon } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listEvents, registerForEvent, cancelEventRegistration } from "../../../api/eventApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// browsable event grid with a register / cancel toggle per card
export default function StudentEvents() {
  const { data: events, isLoading, reload } = useFetch(() => listEvents({}));
  const { showToast } = useToast();
  const [processingEventId, setProcessingEventId] = useState(null);

  const handleToggleRegistration = async (event) => {
    setProcessingEventId(event.id);
    try {
      if (event.isRegistered) {
        await cancelEventRegistration(event.id);
        showToast?.("Registration cancelled");
      } else {
        await registerForEvent(event.id);
        showToast?.("You're registered");
      }
      reload();
    } catch {
      showToast?.("Something went wrong", "error");
    } finally {
      setProcessingEventId(null);
    }
  };

  if (isLoading) return <Loader label="Loading events" />;

  return (
    <div>
      <PageHeader title="Events" description="Workshops, fests and talks happening around campus." />

      {(!events || events.length === 0) && (
        <EmptyState icon={Ticket} title="No events open right now" description="Check back once coordinators publish new events." />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events?.map((event) => (
          <Card key={event.id}>
            <p className="font-medium">{event.title}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={14} /> {event.venue}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <UsersIcon size={14} /> {event.seatsFilled}/{event.seatsTotal} seats filled
            </p>
            <Button
              size="sm"
              variant={event.isRegistered ? "outline" : "primary"}
              className="mt-4"
              isLoading={processingEventId === event.id}
              onClick={() => handleToggleRegistration(event)}
            >
              {event.isRegistered ? "Cancel registration" : "Register"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
