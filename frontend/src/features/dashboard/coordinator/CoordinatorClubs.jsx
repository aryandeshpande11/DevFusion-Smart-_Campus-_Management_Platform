import React, { useState } from "react";
import { Users, Plus } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listClubs, createClub } from "../../../api/clubApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// clubs run by this coordinator — create new ones, see membership counts
export default function CoordinatorClubs() {
  const { data: clubs, isLoading, reload } = useFetch(listClubs);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", description: "" });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      await createClub(formValues);
      showToast?.("Club created");
      setIsModalOpen(false);
      setFormValues({ name: "", description: "" });
      reload();
    } catch {
      showToast?.("Couldn't create the club", "error");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <Loader label="Loading clubs" />;

  return (
    <div>
      <PageHeader
        title="Clubs"
        description="Register clubs and keep an eye on membership."
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={15} /> New club
          </Button>
        }
      />

      {(!clubs || clubs.length === 0) && (
        <EmptyState icon={Users} title="No clubs registered yet" description="Create your first club to start taking members." />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {clubs?.map((club) => (
          <Card key={club.id}>
            <p className="font-medium">{club.name}</p>
            <p className="mt-1 text-sm text-muted">{club.description}</p>
            <p className="mt-3 text-sm text-muted">{club.memberCount ?? 0} members</p>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create club">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input
            required
            placeholder="Club name"
            className="fieldInput"
            value={formValues.name}
            onChange={(event) => setFormValues((current) => ({ ...current, name: event.target.value }))}
          />
          <textarea
            required
            rows={3}
            placeholder="What's this club about?"
            className="fieldInput"
            value={formValues.description}
            onChange={(event) => setFormValues((current) => ({ ...current, description: event.target.value }))}
          />
          <Button type="submit" fullWidth isLoading={isCreating}>
            Create club
          </Button>
        </form>
      </Modal>
    </div>
  );
}
