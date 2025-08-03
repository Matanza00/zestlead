import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui2/button';
import Link from 'next/link';

export default function LoginPage() {
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

    const session = await getSession();
    if (session?.user?.twoFactorPending) {
      setShow2FA(true);
    } else {
      redirectBasedOnRole(session?.user?.role);
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
      const session = await getSession();
      redirectBasedOnRole(session?.user?.role);
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
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <h1 className="pt-8 text-center text-7xl font-bold tracking-tight align-center
            [font-family:'Plus\ Jakarta\ Sans'] font-semibold
            bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
            bg-clip-text [-webkit-background-clip:text]
            text-transparent [-webkit-text-fill-color:transparent] text-shadow-lg/5
          ">
            ZestLeads
            </h1>
          </div>
          <div className="mt-12 flex flex-col items-center">
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center ">
                <button
                  onClick={() => signIn('google')}
                  className="w-full max-w-xs font-bold shadow-xl rounded-lg py-3 bg-green-100/10 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow"
                >
                  <div className="bg-white p-2 rounded-full">
                    <Image
                      src="/auth/google-logo.png"
                      alt="Google Logo"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <span className="ml-4">Sign In with Google</span>
                </button>
              </div>

              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign in with email
                </div>
              </div>

              <form onSubmit={handleLogin} className="mx-auto max-w-xs">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                />
                <button
                  type="submit"
                  className="z-10 mt-5 tracking-wide font-semibold bg-[radial-gradient(115.64%_219.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)] text-white w-full py-4 rounded-lg shadow-xl/15 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">{loading ? 'Logging in...' : 'Sign In'}</span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  By signing in, you agree to ZestLead’s
                  <Link href="/terms" className='border-b border-gray-500 ml-1'> Terms of Service </Link> and
                  <Link href="/privacy" className='border-b border-gray-500 ml-1'> Privacy Policy </Link>.
                </p>

                <div className="text-sm text-center mt-4">
                  Don’t have an account?
                  <span
                    onClick={() => router.push('/auth/signup')}
                    className="ml-1 text-primary hover:underline cursor-pointer"
                  >
                    Sign up
                  </span>
                </div>

              </form>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-green-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
              <Image
              src="/auth/login.svg"
              alt="ZestLead Login Visual"
              width={2500}
              height={2500}
              priority
              className="w-full h-auto object-contain"
            />
            </div>
        </div>
      </div>

      {/* 2FA Modal */}
      {show2FA && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
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
