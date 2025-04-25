'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

export default function NavbarNotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (open) {
      fetch('/api/user/notifications')
        .then((res) => res.json())
        .then(setNotifications);
    }
  }, [open]);

  const markAllAsRead = async () => {
    await fetch('/api/user/notifications/read-all', { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded z-50">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <span className="font-semibold text-sm">Notifications</span>
            <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline">
              Mark all as read
            </button>
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="text-center text-gray-500 text-sm py-3">No notifications</li>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <li
                  key={n.id}
                  className={`px-4 py-2 text-sm border-b hover:bg-gray-50 ${
                    n.read ? 'text-gray-600' : 'text-black font-medium'
                  }`}
                >
                  <div className="truncate">{n.title}</div>
                  <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                </li>
              ))
            )}
          </ul>
          <div className="text-sm px-4 py-2 text-center">
            <Link href="/user/notifications" className="text-blue-600 hover:underline">
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
