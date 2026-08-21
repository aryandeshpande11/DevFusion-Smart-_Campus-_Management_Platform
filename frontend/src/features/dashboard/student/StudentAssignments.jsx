import React, { useState } from "react";
import { FileText, Upload, Github } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader.jsx";
import { Card } from "../../../components/common/Card.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Badge from "../../../components/common/Badge.jsx";
import Button from "../../../components/common/Button.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { getMyAssignments, submitAssignmentSolution } from "../../../api/assignmentApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

const statusTone = { not_submitted: "neutral", pending: "warning", reviewed: "success" };
const statusLabel = { not_submitted: "Not submitted", pending: "Submitted", reviewed: "Reviewed" };

// list of assignments assigned to the student, each with a submit action
export default function StudentAssignments() {
  const { data: assignments, isLoading, reload } = useFetch(getMyAssignments);
  const { showToast } = useToast();
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await submitAssignmentSolution(activeAssignment.id, { githubLink });
      showToast?.("Submission sent");
      setActiveAssignment(null);
      setGithubLink("");
      reload();
    } catch {
      showToast?.("Couldn't submit right now", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader label="Loading assignments" />;

  return (
      <div>
        <PageHeader title="Assignments" description="Everything assigned to you, with deadlines and status." />

        {(!assignments || assignments.length === 0) && (
            <EmptyState icon={FileText} title="No assignments yet" description="New assignments from faculty will land here." />
        )}

        <div className="flex flex-col gap-3">
          {assignments?.map((item) => (
              <Card key={item.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted">
                    {item.courseName} · Due {new Date(item.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={statusTone[item.status] || "neutral"}>{statusLabel[item.status] || item.status}</Badge>
                  {item.status !== "reviewed" && (
                      <Button size="sm" onClick={() => setActiveAssignment(item)}>
                        <Upload size={14} /> Submit
                      </Button>
                  )}
                </div>
              </Card>
          ))}
        </div>

        <Modal isOpen={Boolean(activeAssignment)} onClose={() => setActiveAssignment(null)} title="Submit your solution">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                <Github size={13} className="mr-1 inline" /> GitHub link
              </label>
              <input
                  required
                  placeholder="https://github.com/you/project"
                  className="fieldInput"
                  value={githubLink}
                  onChange={(event) => setGithubLink(event.target.value)}
              />
            </div>
            <Button type="submit" fullWidth isLoading={isSubmitting}>
              Submit
            </Button>
          </form>
        </Modal>
      </div>
  );
}