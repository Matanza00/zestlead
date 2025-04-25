import { useSession, signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage(props) {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
  
    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });
  
    if (res?.error) {
      alert('Invalid email or password');
      setLoading(false);
      return;
    }
  
    // Temporary wait for session to update
    const newSession = await getSession();
    if (newSession?.user?.twoFactorPending) {
      setShow2FA(true);
    } else {
      redirectBasedOnRole(newSession?.user?.role);
    }
  
    setLoading(false);
  };
  
  const handle2FAVerification = async () => {
    const res = await fetch('/api/auth/2fa-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: otp }),
    });
  
    const result = await res.json();
    if (result.success) {
      const newSession = await getSession();
      redirectBasedOnRole(newSession?.user?.role);
    } else {
      alert('Invalid 2FA code');
    }
  };
  
  const redirectBasedOnRole = (role?: string) => {
    if (role === 'ADMIN') router.push('/admin');
    else if (role === 'AGENT') router.push('/user');
    else router.push('/');
  };
  

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow rounded border">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          placeholder="Password"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* 🔐 2FA Modal */}
      {show2FA && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-2 text-center">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Enter the 6-digit code from your Authenticator app.
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3 text-sm text-center"
              maxLength={6}
              placeholder="123456"
            />
            <button
              onClick={handle2FAVerification}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
            >
              Verify & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
