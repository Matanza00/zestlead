// src/pages/user/account/profile.tsx
'use client';
import UserLayout from '@/components/CombinedNavbar';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Interests = {
  propertyTypes: string[];
  desireAreas: string[];
};

export default function ProfilePage(props) {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Interests State ---
  const [options, setOptions] = useState<Interests>({ propertyTypes: [], desireAreas: [] });
  const [interests, setInterests] = useState<Interests>({ propertyTypes: [], desireAreas: [] });
  const [intLoading, setIntLoading] = useState(false);

  // --- Password Modal State ---
  const [showPwModal, setShowPwModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // Load session data
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  // Fetch interest options
  useEffect(() => {
    fetch('/api/user/leads/option')
      .then((res) => res.json())
      .then((data: Interests) => setOptions(data))
      .catch(console.error);
  }, []);

  // Fetch saved interests
  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/user/account/interests')
      .then((res) => res.json())
      .then((data: { interests: Interests | null }) => {
        if (data.interests) setInterests(data.interests);
      })
      .catch(console.error);
  }, [session]);

  // Update name
  const handleSubmitProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/account/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await update();
        toast.success('Profile updated!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  // Save interests
  const handleSaveInterests = async () => {
    setIntLoading(true);
    try {
      const res = await fetch('/api/user/account/interests', {
        method: 'POST',
        credentials: 'include',            // ← ensure cookies go
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests }),
      });
      if (res.ok) {
        toast.success('Interests saved');
      } else {
        toast.error('Failed to save interests');
      }
    } catch {
      toast.error('Error saving interests');
    } finally {
      setIntLoading(false);
    }
  };

  // Handlers for multi-selects
  const onPropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vals = Array.from(e.target.selectedOptions).map(o => o.value);
    setInterests(i => ({ ...i, propertyTypes: vals }));
  };
  const onAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vals = Array.from(e.target.selectedOptions).map(o => o.value);
    setInterests(i => ({ ...i, desireAreas: vals }));
  };

  // Change password
  const handleChangePassword = async () => {
    setPwLoading(true);
    try {
      const res = await fetch('/api/user/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password changed successfully');
        setShowPwModal(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch {
      toast.error('Error changing password');
    } finally {
      setPwLoading(false);
    }
  };


  return (
    <UserLayout>
      <div className="max-w-lg mx-auto p-8 bg-white border border-[#D1D5DC] rounded-lg shadow-lg space-y-8">
        {/* Profile Header */}
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#82E15A] to-[#0A7894] bg-clip-text text-transparent">
          Your Profile
        </h1>

        {/* Email & Name */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={session?.user?.email || ''}
              readOnly
              className="w-full border border-[#D1D5DC] px-4 py-2 rounded-md bg-gray-50 text-sm text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-[#D1D5DC] px-4 py-2 rounded-md text-sm"
            />
          </div>
          <button
            onClick={handleSubmitProfile}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-md text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-sm transition`}
          >
            {loading ? 'Saving…' : 'Update Profile'}
          </button>
        </div>

        {/* Lead Interests Section */}
      {/* Lead Interests Section */}
<div className="space-y-4">
  <h2 className="text-xl font-semibold bg-gradient-to-r from-[#82E15A] to-[#0A7894] bg-clip-text text-transparent">
    Your Lead Interests
  </h2>

  {/* Property Types Picker */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Preferred Property Types
    </label>
    {/* Selected pills */}
    <div className="flex flex-wrap gap-2 mb-2">
      {interests.propertyTypes.map((type) => (
        <span
          key={type}
          className="inline-flex items-center bg-green-100 text-green-800 text-sm rounded-full px-3 py-1"
        >
          {type}
          <button
            type="button"
            onClick={() =>
              setInterests(i => ({
                ...i,
                propertyTypes: i.propertyTypes.filter(t => t !== type),
              }))
            }
            className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
          >
            ×
          </button>
        </span>
      ))}
    </div>

    {/* Dropdown to add */}
    <select
      defaultValue=""
      onChange={(e) => {
        const val = e.target.value;
        if (val && !interests.propertyTypes.includes(val)) {
          setInterests(i => ({
            ...i,
            propertyTypes: [...i.propertyTypes, val],
          }));
        }
        e.target.value = '';
      }}
      className="w-full border border-[#D1D5DC] rounded-md px-3 py-2 text-sm shadow-sm"
    >
      <option value="" disabled hidden>
        Select property type…
      </option>
      {options.propertyTypes.map((type) => (
        <option
          key={type}
          value={type}
          disabled={interests.propertyTypes.includes(type)}
        >
          {type}
        </option>
      ))}
    </select>
  </div>

  {/* Desired Areas Picker */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Preferred Areas
    </label>
    {/* Selected pills */}
    <div className="flex flex-wrap gap-2 mb-2">
      {interests.desireAreas.map((area) => (
        <span
          key={area}
          className="inline-flex items-center bg-blue-100 text-blue-800 text-sm rounded-full px-3 py-1"
        >
          {area}
          <button
            type="button"
            onClick={() =>
              setInterests(i => ({
                ...i,
                desireAreas: i.desireAreas.filter(a => a !== area),
              }))
            }
            className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            ×
          </button>
        </span>
      ))}
    </div>

    {/* Dropdown to add */}
    <select
      defaultValue=""
      onChange={(e) => {
        const val = e.target.value;
        if (val && !interests.desireAreas.includes(val)) {
          setInterests(i => ({
            ...i,
            desireAreas: [...i.desireAreas, val],
          }));
        }
        e.target.value = '';
      }}
      className="w-full border border-[#D1D5DC] rounded-md px-3 py-2 text-sm shadow-sm"
    >
      <option value="" disabled hidden>
        Select area…
      </option>
      {options.desireAreas.map((area) => (
        <option
          key={area}
          value={area}
          disabled={interests.desireAreas.includes(area)}
        >
          {area}
        </option>
      ))}
    </select>
  </div>

  {/* Save Interests Button */}
  <button
    onClick={handleSaveInterests}
    disabled={intLoading}
    className={`w-full px-4 py-2 rounded-md text-white ${
      intLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
    } text-sm transition`}
  >
    {intLoading ? 'Saving…' : 'Save Interests'}
  </button>
</div>



        {/* Change Password Trigger */}
        <div className="pt-4 border-t">
          <button
            onClick={() => setShowPwModal(true)}
            className="text-sm text-[#0A7894] hover:underline"
          >
            Want to change password?
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPwModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full border border-[#D1D5DC] px-3 py-2 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full border border-[#D1D5DC] px-3 py-2 rounded-md text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPwModal(false)}
                disabled={pwLoading}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={pwLoading}
                className={`px-4 py-2 rounded-md text-white ${
                  pwLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                } text-sm`}
              >
                {pwLoading ? 'Updating…' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
