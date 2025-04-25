'use client';
import UserLayout from '@/layouts/UserLayout';
import { useEffect, useState } from 'react';

export default function NotificationSettingsPage(props) {
  const [settings, setSettings] = useState({
    emailNotification: true,
    inAppNotification: true,
    notifyPayment: true,
    notifySubscription: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/notification/settings')
      .then(res => res.json())
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const updateSetting = async (field: keyof typeof settings) => {
    const updated = { ...settings, [field]: !settings[field] };
    setSettings(updated);

    await fetch('/api/user/notification/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  };

  return (
    <UserLayout>
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Notification Preferences</h1>

      {loading ? <p>Loading...</p> : (
        <>
          {[
            { label: 'Email Alerts', key: 'emailNotification' },
            { label: 'In-App Alerts', key: 'inAppNotification' },
            { label: 'Payment Confirmations', key: 'notifyPayment' },
            { label: 'Subscription Reminders', key: 'notifySubscription' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between border-b py-3">
              <span>{item.label}</span>
              <button
                onClick={() => updateSetting(item.key as keyof typeof settings)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  settings[item.key as keyof typeof settings]
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {settings[item.key as keyof typeof settings] ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          ))}
        </>
      )}
    </div>
    </UserLayout>
  );
}
