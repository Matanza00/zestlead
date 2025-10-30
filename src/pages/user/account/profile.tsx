// src/pages/user/account/profile.tsx
'use client';
import UserLayout from '@/components/CombinedNavbar';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link2, Copy, Users, Percent, Ticket, CheckCircle2, RefreshCw } from 'lucide-react';

type Interests = { propertyTypes: string[]; desireAreas: string[]; };
type ReferralRow = {
  id: string; referredEmail: string;
  status: 'PENDING' | 'SIGNED_UP' | 'SUBSCRIBED' | 'REWARDED';
  rewardedAt: string | null; createdAt: string; updatedAt: string;
};
type ReferralStats = { total: number; pending: number; signedUp: number; subscribed: number; rewarded: number; };
type ReferralCode = {
  assignmentId: string; code: string; description?: string | null;
  percentage: number; maxCapUSD?: number | null; assignedAt: string;
};

export default function ProfilePage(props) {
  const { data: session, update } = useSession();
  const [name, setName] = useState(''); const [loading, setLoading] = useState(false);

  // Interests
  const [options, setOptions] = useState<Interests>({ propertyTypes: [], desireAreas: [] });
  const [interests, setInterests] = useState<Interests>({ propertyTypes: [], desireAreas: [] });
  const [intLoading, setIntLoading] = useState(false);

  // Password modal
  const [showPwModal, setShowPwModal] = useState(false);
  const [newPassword, setNewPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // Referrals
  const [refLoading, setRefLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [refStats, setRefStats] = useState<ReferralStats>({ total: 0, pending: 0, signedUp: 0, subscribed: 0, rewarded: 0 });
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const codesAvailable = codes.length;

  // Load base data
  useEffect(() => { if (session?.user?.name) setName(session.user.name); }, [session]);
  useEffect(() => {
    fetch('/api/user/leads/option')
      .then(res => res.json())
      .then((data: Interests) => setOptions(data))
      .catch(console.error);
  }, []);
  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/user/account/interests')
      .then(res => res.json())
      .then((data: { interests: Interests | null }) => { if (data.interests) setInterests(data.interests); })
      .catch(console.error);
  }, [session]);

  const handleSubmitProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/account/update-profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) { await update(); toast.success('Profile updated!'); }
      else toast.error('Failed to update profile');
    } catch { toast.error('Error updating profile'); }
    finally { setLoading(false); }
  };

  const handleSaveInterests = async () => {
    setIntLoading(true);
    try {
      const res = await fetch('/api/user/account/interests', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests }),
      });
      if (res.ok) toast.success('Interests saved'); else toast.error('Failed to save interests');
    } catch { toast.error('Error saving interests'); }
    finally { setIntLoading(false); }
  };

  const handleChangePassword = async () => {
    setPwLoading(true);
    try {
      const res = await fetch('/api/user/account/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (res.ok) { toast.success('Password changed'); setShowPwModal(false); setNewPassword(''); setConfirmPassword(''); }
      else toast.error(data.error || 'Failed to change password');
    } catch { toast.error('Error changing password'); }
    finally { setPwLoading(false); }
  };

  // Referral center
  const referralLink = useMemo(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://zestleads.com';
    return referralCode ? `${base}/auth/signup?ref=${referralCode}` : '';
  }, [referralCode]);

  const loadReferrals = async () => {
    setRefLoading(true);
    try {
      const r = await fetch('/api/user/referrals', { credentials: 'include' });
      if (!r.ok) throw new Error('load failed');
      const data = await r.json();
      setReferralCode(data.referralCode || '');
      setRefStats(data.stats || { total: 0, pending: 0, signedUp: 0, subscribed: 0, rewarded: 0 });
      setReferrals(data.referrals || []);
    } catch (e) { console.error(e); toast.error('Failed to load referral data'); }
    finally { setRefLoading(false); }
  };

  const loadCodes = async () => {
    try {
      const r = await fetch('/api/user/referrals/codes', { credentials: 'include' });
      if (!r.ok) return setCodes([]);
      const data = await r.json();
      const sanitized = (data.codes || []).filter((c: ReferralCode) => {
        const hay = `${c.code} ${c.description || ''}`;
        return !/(growth|pro)/i.test(hay); // 🚫 drop any code mentioning GROWTH/PRO
      });
      setCodes(sanitized);
    } catch { setCodes([]); }
  };

  useEffect(() => { if (session?.user?.id) { loadReferrals(); loadCodes(); } }, [session?.user?.id]);

  const copyReferral = async () => {
    if (!referralLink) return;
    try { await navigator.clipboard.writeText(referralLink); toast.success('Referral link copied!'); }
    catch { toast.error('Copy failed'); }
  };
  const copyCode = async (code: string) => {
    try { await navigator.clipboard.writeText(code); toast.success('Code copied!'); }
    catch { toast.error('Copy failed'); }
  };

  return (
    <UserLayout>
      {/* FULL-WIDTH layout */}
      <div className="w-full px-4 md:px-6 lg:px-10 py-8 space-y-8">
        {/* Brand title */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight
                       [font-family:'Plus_Jakarta_Sans']
                       bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
                       bg-clip-text text-transparent">
          Account
        </h1>

        {/* Two responsive full-width cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile + Interests (stretches to column width) */}
          <div className="w-full rounded-2xl border border-[#D1D5DC] bg-white/90 shadow-sm p-6 sm:p-8 space-y-8">
            <h2 className="text-xl font-semibold
                           bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
                           bg-clip-text text-transparent">
              Your Profile
            </h2>

            {/* Email & Name */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={session?.user?.email || ''}
                  readOnly
                  className="w-full border border-[#D1D5DC] px-4 py-2 rounded-lg bg-gray-50 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-[#D1D5DC] px-4 py-2 rounded-lg text-sm"
                />
              </div>
              <button
                onClick={handleSubmitProfile}
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg text-white text-sm transition
                  ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-green-600 to-blue-500 hover:brightness-105'}`}
              >
                {loading ? 'Saving…' : 'Update Profile'}
              </button>
            </div>

            {/* Interests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold
                             bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
                             bg-clip-text text-transparent">
                Your Lead Interests
              </h3>

              {/* Property Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Property Types</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {interests.propertyTypes.map((type) => (
                    <span key={type}
                      className="inline-flex items-center bg-green-50 text-green-800 text-xs sm:text-sm rounded-full px-3 py-1 border border-green-200">
                      {type}
                      <button
                        type="button"
                        onClick={() => setInterests(i => ({ ...i, propertyTypes: i.propertyTypes.filter(t => t !== type) }))}
                        className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                        aria-label={`Remove ${type}`}
                      >×</button>
                    </span>
                  ))}
                </div>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !interests.propertyTypes.includes(val)) {
                      setInterests(i => ({ ...i, propertyTypes: [...i.propertyTypes, val] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-[#D1D5DC] rounded-lg px-3 py-2 text-sm shadow-sm"
                >
                  <option value="" disabled hidden>Select property type…</option>
                  {options.propertyTypes.map((type) => (
                    <option key={type} value={type} disabled={interests.propertyTypes.includes(type)}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Areas</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {interests.desireAreas.map((area) => (
                    <span key={area}
                      className="inline-flex items-center bg-blue-50 text-blue-800 text-xs sm:text-sm rounded-full px-3 py-1 border border-blue-200">
                      {area}
                      <button
                        type="button"
                        onClick={() => setInterests(i => ({ ...i, desireAreas: i.desireAreas.filter(a => a !== area) }))}
                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        aria-label={`Remove ${area}`}
                      >×</button>
                    </span>
                  ))}
                </div>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !interests.desireAreas.includes(val)) {
                      setInterests(i => ({ ...i, desireAreas: [...i.desireAreas, val] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-[#D1D5DC] rounded-lg px-3 py-2 text-sm shadow-sm"
                >
                  <option value="" disabled hidden>Select area…</option>
                  {options.desireAreas.map((area) => (
                    <option key={area} value={area} disabled={interests.desireAreas.includes(area)}>{area}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSaveInterests}
                disabled={intLoading}
                className={`w-full px-4 py-2 rounded-lg text-white text-sm transition
                  ${intLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-green-600 to-blue-500 hover:brightness-105'}`}
              >
                {intLoading ? 'Saving…' : 'Save Interests'}
              </button>
            </div>

            {/* Password */}
            <div className="pt-4 border-t">
              <button onClick={() => setShowPwModal(true)} className="text-sm text-[#0A7894] hover:underline">
                Want to change password?
              </button>
            </div>
          </div>

          {/* Referral Center (stretches to column width) */}
          <div className="w-full rounded-2xl border border-[#D1D5DC] bg-white/90 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0A7894]" /> Referral Center
              </h2>
              <button
                onClick={() => { loadReferrals(); loadCodes(); }}
                className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            {/* Share link */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1">
                <Link2 className="w-4 h-4 text-gray-600" />
                <span className="truncate">{refLoading ? 'Loading…' : (referralLink || '—')}</span>
              </div>
              <button
                onClick={copyReferral}
                disabled={!referralLink}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg text-white
                           bg-gradient-to-r from-green-600 to-blue-500 hover:brightness-105 disabled:opacity-50"
              >
                <Copy className="w-4 h-4" /> Copy Link
              </button>
            </div>

            {/* Stat tiles (no plan references) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <StatTile label="Total" value={refStats.total} />
              <StatTile label="Signed Up" value={refStats.signedUp} />
              <StatTile label="Subscribed" value={refStats.subscribed} />
              <StatTile label="Rewarded" value={refStats.rewarded} />
              <div className="border rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Codes Available</div>
                  <div className="text-lg font-semibold">{codesAvailable}</div>
                </div>
                <Ticket className="w-5 h-5 text-green-600" />
              </div>
            </div>

            {/* Codes list (filtered) */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#0A7894]" /> Your Referral Codes
              </h3>
              {codes.length === 0 ? (
                <div className="text-sm text-gray-500 border rounded-lg p-4 bg-gray-50">
                  You don’t have any active referral codes yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {codes.map((c) => (
                    <div key={c.assignmentId}
                      className="flex items-center justify-between border rounded-lg px-3 py-2 bg-white">
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{c.code}</div>
                        <div className="text-xs text-gray-500">
                          {(c.description && !/(growth|pro)/i.test(c.description)) ? c.description : 'Referral reward · 100% up to $200'}
                          {' · Assigned '}{new Date(c.assignedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => copyCode(c.code)}
                        className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-gray-500 mt-2">
                Apply a code during checkout. Each code is single-use and covers 100% up to $200.
              </p>
            </div>

            {/* Referral table */}
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-3 py-2">Referred Email</th>
                    <th className="text-left px-3 py-2">Status</th>
                    <th className="text-left px-3 py-2">Rewarded</th>
                    <th className="text-left px-3 py-2">Invited</th>
                  </tr>
                </thead>
                <tbody>
                  {refLoading ? (
                    <tr><td colSpan={4} className="px-3 py-6 text-center">Loading…</td></tr>
                  ) : referrals.length === 0 ? (
                    <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-500">No referrals yet.</td></tr>
                  ) : (
                    referrals.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="px-3 py-2">{r.referredEmail}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs
                            ${r.status === 'REWARDED' ? 'bg-green-100 text-green-800' :
                              r.status === 'SUBSCRIBED' ? 'bg-blue-100 text-blue-800' :
                              r.status === 'SIGNED_UP' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-700'}`}>
                            {r.status}
                            {r.status === 'REWARDED' && <CheckCircle2 className="w-3 h-3" />}
                          </span>
                        </td>
                        <td className="px-3 py-2">{r.rewardedAt ? new Date(r.rewardedAt).toLocaleDateString() : '—'}</td>
                        <td className="px-3 py-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showPwModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-11/12 max-w-sm shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                         className="w-full border border-[#D1D5DC] px-3 py-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                         className="w-full border border-[#D1D5DC] px-3 py-2 rounded-lg text-sm" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowPwModal(false)} disabled={pwLoading}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm">Cancel</button>
                <button onClick={handleChangePassword} disabled={pwLoading}
                        className={`px-4 py-2 rounded-lg text-white text-sm
                          ${pwLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-green-600 to-blue-500 hover:brightness-105'}`}>
                  {pwLoading ? 'Updating…' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-xl p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
