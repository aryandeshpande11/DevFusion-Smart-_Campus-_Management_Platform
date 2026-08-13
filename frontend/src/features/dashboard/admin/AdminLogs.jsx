import React, { useState } from "react";
import { ScrollText } from "lucide-react";
import { PageHeader, DataTable } from "../../../components/common/PageHeader.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Button from "../../../components/common/Button.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listActivityLogs } from "../../../api/analyticsApi.js";

// paginated audit log of sensitive admin actions
export default function AdminLogs() {
  const [page, setPage] = useState(1);
  const { data: logs, isLoading } = useFetch(() => listActivityLogs(page), [page]);

  if (isLoading) return <Loader label="Loading activity logs" />;

  return (
    <div>
      <PageHeader title="Logs" description="Audit trail of sensitive actions taken on the platform." />

      {(!logs || logs.length === 0) && (
        <EmptyState icon={ScrollText} title="Nothing logged yet" description="Admin actions will be recorded here as they happen." />
      )}

      {logs && logs.length > 0 && (
        <>
          <DataTable
            columns={[
              { key: "actorName", label: "Actor" },
              { key: "action", label: "Action" },
              { key: "entityType", label: "Entity" },
              { key: "createdAt", label: "When" },
            ]}
            rows={logs}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
