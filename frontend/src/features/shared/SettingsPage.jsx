import React, { useState } from "react";
import { PageHeader } from "../../components/common/PageHeader.jsx";
import { Card } from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import { useUiStore } from "../../store/uiStore.js";
import { useAuth } from "../../hooks/useAuth.js";

// account-level preferences — theme, notification channels, connected
// accounts and the danger-zone delete action from the system design
export default function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useUiStore();
  const { currentUser, logOut } = useAuth();
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Theme, notifications and account controls." />

      <Card className="max-w-xl">
        <h3 className="font-medium">Appearance</h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-muted">Dark mode</p>
          <button
            onClick={toggleDarkMode}
            className={`h-6 w-11 rounded-full transition ${isDarkMode ? "bg-brand-500" : "bg-black/10"}`}
          >
            <span
              className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition ${
                isDarkMode ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </Card>

      <Card className="max-w-xl">
        <h3 className="font-medium">Notification preferences</h3>
        <div className="mt-3 flex flex-col gap-3">
          <label className="flex items-center justify-between text-sm">
            Email notifications
            <input
              type="checkbox"
              checked={notifyByEmail}
              onChange={() => setNotifyByEmail((value) => !value)}
            />
          </label>
          <label className="flex items-center justify-between text-sm">
            In-app notifications
            <input
              type="checkbox"
              checked={notifyInApp}
              onChange={() => setNotifyInApp((value) => !value)}
            />
          </label>
        </div>
      </Card>

      <Card className="max-w-xl">
        <h3 className="font-medium">Connected accounts</h3>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span>Google</span>
          <span className="text-muted">{currentUser?.googleId ? "Connected" : "Not connected"}</span>
        </div>
      </Card>

      <Card className="max-w-xl border-danger/30">
        <h3 className="font-medium text-danger">Danger zone</h3>
        <p className="mt-1 text-sm text-muted">Log out of this device, or permanently delete your account.</p>
        <div className="mt-4 flex gap-3">
          <Button variant="outline" onClick={logOut}>
            Log out
          </Button>
          <Button variant="danger">Delete account</Button>
        </div>
      </Card>
    </div>
  );
}
