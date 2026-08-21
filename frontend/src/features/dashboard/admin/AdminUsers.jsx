import React, { useState } from "react";
import { Users } from "lucide-react";
import { PageHeader, DataTable } from "../../../components/common/PageHeader.jsx";
import Loader from "../../../components/common/Loader.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";
import Badge from "../../../components/common/Badge.jsx";
import Button from "../../../components/common/Button.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import {
  listAllUsers,
  listRoles,
  changeUserRole,
  setUserActiveStatus,
  deleteUserAccount,
} from "../../../api/userApi.js";
import { useToast } from "../../../components/common/Toast.jsx";

// full user directory with inline role changes, activate/deactivate, and delete
export default function AdminUsers() {
  const { data: users, isLoading, reload } = useFetch(listAllUsers);
  const { data: roles } = useFetch(listRoles);
  const { showToast } = useToast();
  const [busyUserId, setBusyUserId] = useState(null);

  const handleRoleChange = async (userId, newRoleId) => {
    setBusyUserId(userId);
    try {
      await changeUserRole(userId, newRoleId);
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

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name || user.email}? This can't be undone.`)) return;
    setBusyUserId(user.id);
    try {
      await deleteUserAccount(user.id);
      showToast?.("User deleted");
      reload();
    } catch {
      showToast?.("Couldn't delete the user", "error");
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
                            value={row.roleId || row.role?.id || ""}
                            disabled={busyUserId === row.id || !roles}
                            onChange={(event) => handleRoleChange(row.id, event.target.value)}
                        >
                          {(roles || []).map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
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
                        <div className="flex items-center gap-2">
                          <Button
                              size="sm"
                              variant="outline"
                              isLoading={busyUserId === row.id}
                              onClick={() => handleToggleActive(row)}
                          >
                            {row.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                              size="sm"
                              variant="danger"
                              isLoading={busyUserId === row.id}
                              onClick={() => handleDelete(row)}
                          >
                            Delete
                          </Button>
                        </div>
                    ),
                  },
                ]}
                rows={users}
            />
        )}
      </div>
  );
}