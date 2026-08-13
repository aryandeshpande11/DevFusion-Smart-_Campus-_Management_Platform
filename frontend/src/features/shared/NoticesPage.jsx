import React, { useState } from "react";
import { Megaphone, Plus } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader.jsx";
import { Card } from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import Modal from "../../components/common/Modal.jsx";
import Badge from "../../components/common/Badge.jsx";
import { useFetch } from "../../hooks/useFetch.js";
import { listNotices, publishNotice } from "../../api/noticeApi.js";
import { useToast } from "../../components/common/Toast.jsx";

// notices/announcements list — faculty, coordinator and admin get a
// "New notice" button, students get a read-only feed
export default function NoticesPage({ canPublish = false }) {
  const { data: notices, isLoading, reload } = useFetch(listNotices);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ title: "", content: "", targetRole: "all" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await publishNotice(formValues);
      showToast?.("Notice published");
      setIsModalOpen(false);
      setFormValues({ title: "", content: "", targetRole: "all" });
      reload();
    } catch {
      showToast?.("Couldn't publish the notice", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Notices"
        description="Announcements targeted to your role and department."
        action={
          canPublish && (
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus size={15} /> New notice
            </Button>
          )
        }
      />

      {isLoading && <Loader label="Loading notices" />}

      {!isLoading && (!notices || notices.length === 0) && (
        <EmptyState
          icon={Megaphone}
          title="No notices yet"
          description="Announcements posted for your role will show up here."
        />
      )}

      <div className="flex flex-col gap-3">
        {notices?.map((notice) => (
          <Card key={notice.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{notice.title}</p>
                <p className="mt-1 text-sm text-muted">{notice.content}</p>
              </div>
              <Badge tone="brand">{notice.targetRole || "all"}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish a notice">
        <form onSubmit={handlePublish} className="flex flex-col gap-4">
          <input
            required
            placeholder="Title"
            className="fieldInput"
            value={formValues.title}
            onChange={(event) => setFormValues((current) => ({ ...current, title: event.target.value }))}
          />
          <textarea
            required
            rows={4}
            placeholder="What do people need to know?"
            className="fieldInput"
            value={formValues.content}
            onChange={(event) => setFormValues((current) => ({ ...current, content: event.target.value }))}
          />
          <select
            className="fieldInput"
            value={formValues.targetRole}
            onChange={(event) => setFormValues((current) => ({ ...current, targetRole: event.target.value }))}
          >
            <option value="all">Everyone</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
          </select>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Publish
          </Button>
        </form>
      </Modal>
    </div>
  );
}
