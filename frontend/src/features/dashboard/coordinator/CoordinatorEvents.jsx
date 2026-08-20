import React, { useState } from "react";
import { Ticket, Plus, MapPin } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listEvents, createEvent } from "../../../api/eventApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// coordinator's event management — create + browse everything they've published
export default function CoordinatorEvents() {
  const { data: events, isLoading, reload } = useFetch(() => listEvents({}));
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ title: "", venue: "", seatsTotal: "", registrationDeadline: "" });
  const [isCreating, setIsCreating] = useState(false);

  const updateField = (fieldName) => (event) =>
      setFormValues((current) => ({ ...current, [fieldName]: event.target.value }));

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      await createEvent({
        ...formValues,
        seatsTotal: Number(formValues.seatsTotal),
        registrationDeadline: new Date(formValues.registrationDeadline).toISOString(),
      });
      showToast?.("Event created");
      setIsModalOpen(false);
      setFormValues({ title: "", venue: "", seatsTotal: "", registrationDeadline: "" });
      reload();
    } catch (error) {
      showToast?.(error?.response?.data?.message || "Couldn't create the event", "error");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <Loader label="Loading events" />;

  return (
      <div>
        <PageHeader
            title="Events"
            description="Create events and track registrations."
            action={
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus size={15} /> New event
              </Button>
            }
        />

        {(!events || events.length === 0) && (
            <EmptyState icon={Ticket} title="No events created yet" description="Your first event will show up here once published." />
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

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create event">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <input required placeholder="Event title" className="fieldInput" value={formValues.title} onChange={updateField("title")} />
            <input required placeholder="Venue" className="fieldInput" value={formValues.venue} onChange={updateField("venue")} />
            <input
                required
                type="number"
                placeholder="Total seats"
                className="fieldInput"
                value={formValues.seatsTotal}
                onChange={updateField("seatsTotal")}
            />
            <input
                required
                type="date"
                className="fieldInput"
                value={formValues.registrationDeadline}
                onChange={updateField("registrationDeadline")}
            />
            <Button type="submit" fullWidth isLoading={isCreating}>
              Create event
            </Button>
          </form>
        </Modal>
      </div>
  );
}