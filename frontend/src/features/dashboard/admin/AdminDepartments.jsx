import React, { useState } from "react";
import { Building2, Plus } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listDepartments, createDepartment } from "../../../api/analyticsApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// department directory — admin-only creation
export default function AdminDepartments() {
  const { data: departments, isLoading, reload } = useFetch(listDepartments);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", code: "" });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      await createDepartment(formValues);
      showToast?.("Department added");
      setIsModalOpen(false);
      setFormValues({ name: "", code: "" });
      reload();
    } catch {
      showToast?.("Couldn't add the department", "error");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <Loader label="Loading departments" />;

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Every academic department on the platform."
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={15} /> New department
          </Button>
        }
      />

      {(!departments || departments.length === 0) && (
        <EmptyState icon={Building2} title="No departments yet" description="Add your first department to start assigning courses." />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {departments?.map((department) => (
          <Card key={department.id}>
            <p className="font-medium">{department.name}</p>
            <p className="mt-1 text-sm text-muted">{department.code}</p>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add department">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input
            required
            placeholder="Department name"
            className="fieldInput"
            value={formValues.name}
            onChange={(event) => setFormValues((current) => ({ ...current, name: event.target.value }))}
          />
          <input
            required
            placeholder="Short code, e.g. CSE"
            className="fieldInput"
            value={formValues.code}
            onChange={(event) => setFormValues((current) => ({ ...current, code: event.target.value }))}
          />
          <Button type="submit" fullWidth isLoading={isCreating}>
            Add department
          </Button>
        </form>
      </Modal>
    </div>
  );
}
