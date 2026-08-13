import { useEffect, useState } from "react";
import { getSocketConnection } from "../api/socketClient";
import { listMyNotifications, markAllNotificationsRead } from "../api/notificationApi";
import { useAuthStore } from "../store/authStore";

// keeps the bell icon's unread count live — loads the current inbox once,
// then bumps the count whenever the server pushes a "notification:new" event
export function useLiveNotifications() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    listMyNotifications().then((inbox) => {
      setNotifications(inbox);
      setUnreadCount(inbox.filter((item) => !item.isRead).length);
    });

    const socket = getSocketConnection();
    if (!socket) return;

    const handleNewNotification = (incoming) => {
      setNotifications((current) => [incoming, ...current]);
      setUnreadCount((count) => count + 1);
    };

    socket.on("notification:new", handleNewNotification);
    return () => socket.off("notification:new", handleNewNotification);
  }, [currentUser]);

  const markAllAsRead = async () => {
    await markAllNotificationsRead();
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markAllAsRead };
}
