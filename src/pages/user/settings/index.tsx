'use client';
import UserLayout from '@/components/CombinedNavbar';
import TwoFATabs from '@/components/TwoFATab';

export default function SettingsPage(props) {
  return (
    <UserLayout>
  <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
    <h1 className="text-xl font-semibold text-gray-800">User Settings</h1>

    {/* 2FA Toggle */}
    <section>
      <h2 className="text-lg font-medium text-gray-700 mb-2">Two-Factor Authentication (2FA)</h2>
      <TwoFATabs />
    </section>

    {/* Other Settings Example */}
    <section>
      <h2 className="text-lg font-medium text-gray-700 mb-2">Notification Preferences</h2>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox" />
          <span>Email me when new leads are posted</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox" />
          <span>Push alerts for lead updates</span>
        </label>
      </div>
    </section>
  </div>
</UserLayout>

  );
}
