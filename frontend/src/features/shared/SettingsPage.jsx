import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader.jsx";
import { Card } from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import { useUiStore } from "../../store/uiStore.js";
import { useAuthStore } from "../../store/authStore.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useToast } from "../../components/common/Toast.jsx";
import { getMySettings, updateMySettings, deleteMyAccount } from "../../api/settingsApi.js";

// account-level preferences — theme, notification channels, connected
// accounts and the danger-zone delete action from the system design
export default function SettingsPage() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useUiStore();
  const clearSession = useAuthStore((state) => state.clearSession);
  const { currentUser, logOut } = useAuth();
  const { showToast } = useToast();

  const { data: settings, isLoading } = useFetch(getMySettings);

  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // seed the checkboxes from the saved settings once they load, and make sure
  // the theme toggle reflects what's actually saved server-side (not just
  // whatever was left over in local storage from a previous account)
  useEffect(() => {
    if (!settings) return;
    if (settings.notificationPrefs) {
      setNotifyByEmail(settings.notificationPrefs.email ?? true);
      setNotifyInApp(settings.notificationPrefs.inApp ?? true);
    }
    const serverPrefersDark = settings.theme === "dark";
    if (serverPrefersDark !== isDarkMode) toggleDarkMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const handleToggleDarkMode = async () => {
    const nextIsDark = !isDarkMode;
    toggleDarkMode();
    try {
      await updateMySettings({ theme: nextIsDark ? "dark" : "light" });
    } catch {
      showToast?.("Couldn't save theme preference", "error");
    }
  };

  const persistNotificationPrefs = async (nextEmail, nextInApp) => {
    try {
      await updateMySettings({ notificationPrefs: { email: nextEmail, inApp: nextInApp } });
    } catch {
      showToast?.("Couldn't save notification preference", "error");
    }
  };

  const handleToggleEmailNotifications = () => {
    const next = !notifyByEmail;
    setNotifyByEmail(next);
    persistNotificationPrefs(next, notifyInApp);
  };

  const handleToggleInAppNotifications = () => {
    const next = !notifyInApp;
    setNotifyInApp(next);
    persistNotificationPrefs(notifyByEmail, next);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "This permanently deletes your account and all associated data. This can't be undone. Continue?"
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteMyAccount();
      clearSession();
      navigate("/login");
    } catch {
      showToast?.("Couldn't delete your account", "error");
      setIsDeleting(false);
    }
  };

  if (isLoading) return <Loader label="Loading settings" />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Theme, notifications and account controls." />

      <Card className="max-w-xl">
        <h3 className="font-medium">Appearance</h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-muted">Dark mode</p>
          <button
            onClick={handleToggleDarkMode}
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
            <input type="checkbox" checked={notifyByEmail} onChange={handleToggleEmailNotifications} />
          </label>
          <label className="flex items-center justify-between text-sm">
            In-app notifications
            <input type="checkbox" checked={notifyInApp} onChange={handleToggleInAppNotifications} />
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
          <Button variant="danger" onClick={handleDeleteAccount} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete account"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
