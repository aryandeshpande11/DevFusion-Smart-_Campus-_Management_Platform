import React, { useState } from "react";
import { Users } from "lucide-react";
import { PageHeader, DataTable } from "../../../components/common/PageHeader.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Badge from "../../../components/common/Badge.jsx";
import Button from "../../../components/common/Button.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { listAllUsers, changeUserRole, setUserActiveStatus } from "../../../api/userApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// full user directory with inline role changes and activate/deactivate
export default function AdminUsers() {
  const { data: users, isLoading, reload } = useFetch(listAllUsers);
  const { showToast } = useToast();
  const [busyUserId, setBusyUserId] = useState(null);

  const handleRoleChange = async (userId, newRole) => {
    setBusyUserId(userId);
    try {
      await changeUserRole(userId, newRole);
      showToast?.("Role updated");
      reload();
    } catch {
      showToast?.("Couldn't update the role", "error");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleToggleActive = async (user) => {
    setBusyUserId(user.id);
    try {
      await setUserActiveStatus(user.id, !user.isActive);
      showToast?.(user.isActive ? "User deactivated" : "User activated");
      reload();
    } catch {
      showToast?.("Couldn't update the status", "error");
    } finally {
      setBusyUserId(null);
    }
  };

  if (isLoading) return <Loader label="Loading users" />;

  return (
    <div>
      <PageHeader title="Users" description="Manage every account on the platform." />

      {(!users || users.length === 0) && (
        <EmptyState icon={Users} title="No users yet" description="Accounts will show up here as people sign up." />
      )}

      {users && users.length > 0 && (
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            {
              key: "role",
              label: "Role",
              render: (row) => (
                <select
                  className="rounded-md border border-border bg-transparent px-2 py-1 text-xs dark:border-white/10"
                  value={row.role}
                  disabled={busyUserId === row.id}
                  onChange={(event) => handleRoleChange(row.id, event.target.value)}
                >
                  {["student", "faculty", "coordinator", "admin"].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              ),
            },
            {
              key: "isActive",
              label: "Status",
              render: (row) => (
                <Badge tone={row.isActive ? "success" : "danger"}>{row.isActive ? "active" : "inactive"}</Badge>
              ),
            },
            {
              key: "actions",
              label: "",
              render: (row) => (
                <Button
                  size="sm"
                  variant="outline"
                  isLoading={busyUserId === row.id}
                  onClick={() => handleToggleActive(row)}
                >
                  {row.isActive ? "Deactivate" : "Activate"}
                </Button>
              ),
            },
          ]}
          rows={users}
        />
      )}
    </div>
  );
}
