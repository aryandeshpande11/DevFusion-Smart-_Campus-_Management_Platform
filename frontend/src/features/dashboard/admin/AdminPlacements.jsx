import React, { useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import { PageHeader, DataTable } from "../../../components/common/PageHeader.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listPlacementPostings, createPlacementPosting } from "../../../api/placementApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// admin-side placement postings — create drives, see applicant counts
export default function AdminPlacements() {
  const { data: placements, isLoading, reload } = useFetch(listPlacementPostings);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ companyName: "", jobRole: "", ctc: "", deadline: "" });
  const [isCreating, setIsCreating] = useState(false);

  const updateField = (fieldName) => (event) =>
    setFormValues((current) => ({ ...current, [fieldName]: event.target.value }));

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      await createPlacementPosting(formValues);
      showToast?.("Placement posted");
      setIsModalOpen(false);
      setFormValues({ companyName: "", jobRole: "", ctc: "", deadline: "" });
      reload();
    } catch {
      showToast?.("Couldn't post the drive", "error");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <Loader label="Loading placements" />;

  return (
    <div>
      <PageHeader
        title="Placements"
        description="Post company drives and track applicants."
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={15} /> New drive
          </Button>
        }
      />

      {(!placements || placements.length === 0) && (
        <EmptyState icon={Briefcase} title="No drives posted yet" description="Post a company opening to get started." />
      )}

      {placements && placements.length > 0 && (
        <DataTable
          columns={[
            { key: "companyName", label: "Company" },
            { key: "jobRole", label: "Role" },
            { key: "ctc", label: "CTC" },
            { key: "deadline", label: "Deadline" },
            { key: "applicantCount", label: "Applicants" },
          ]}
          rows={placements}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post a placement drive">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input required placeholder="Company name" className="fieldInput" value={formValues.companyName} onChange={updateField("companyName")} />
          <input required placeholder="Job role" className="fieldInput" value={formValues.jobRole} onChange={updateField("jobRole")} />
          <input required placeholder="CTC, e.g. 8 LPA" className="fieldInput" value={formValues.ctc} onChange={updateField("ctc")} />
          <input required type="date" className="fieldInput" value={formValues.deadline} onChange={updateField("deadline")} />
          <Button type="submit" fullWidth isLoading={isCreating}>
            Post drive
          </Button>
        </form>
      </Modal>
    </div>
  );
}
