// src/pages/auth/signup.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function SignupPage(props) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  // Decode incoming callbackUrl once
  const rawCb = Array.isArray(router.query.callbackUrl)
    ? router.query.callbackUrl[0]
    : (router.query.callbackUrl as string) || '';
  const callbackUrl = rawCb ? decodeURIComponent(rawCb) : '';

  // NEW: capture ?ref= from the URL
  const referralCode = useMemo(() => {
    const rawRef = Array.isArray(router.query.ref)
      ? router.query.ref[0]
      : (router.query.ref as string) || '';
    return rawRef.trim();
  }, [router.query.ref]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // NEW: include referralCode when present
      body: JSON.stringify({ ...form, referralCode }),
    });

    if (res.ok) {
      const suffix = callbackUrl
        ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : '';
      router.push(`/auth/login${suffix}`);
    } else {
      const { error } = await res.json().catch(() => ({ error: 'Signup failed' }));
      alert(error || 'Signup failed');
    }
  };

  const handleGoogle = () => {
    // You can also pass referralCode via a cookie/query if you want it honored in the Google flow
    signIn('google', { callbackUrl: callbackUrl || '/' });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <h1
            className="pt-8 text-center text-7xl font-bold tracking-tight align-center
            [font-family:'Plus_Jakarta_Sans'] font-semibold
            bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
            bg-clip-text [-webkit-background-clip:text]
            text-transparent [-webkit-text-fill-color:transparent] text-shadow-lg/5"
          >
            ZestLeads
          </h1>

          <div className="mt-12 flex flex-col items-center">
            <button
              onClick={handleGoogle}
              className="w-full max-w-xs font-bold shadow-xl rounded-lg py-3 bg-green-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow"
            >
              <div className="bg-white p-2 rounded-full">
                <Image src="/auth/google-logo.png" alt="Google Logo" width={24} height={24} className="w-6 h-6" />
              </div>
              <span className="ml-4">Sign Up with Google</span>
            </button>

            <div className="my-12 border-b text-center">
              <span className="px-2 bg-white text-sm text-gray-600">
                Or sign up with email
              </span>
            </div>

            {/* Optional: show detected ref code */}
            {referralCode ? (
              <div className="mb-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                Referred by code: <span className="font-mono">{referralCode}</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
              <input
                type="text"
                placeholder="Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-8 py-4 mb-4 rounded-lg border bg-gray-100 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-8 py-4 mb-4 rounded-lg border bg-gray-100 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-8 py-4 mb-6 rounded-lg border bg-gray-100 focus:outline-none"
              />

              {/* Optional visible input if you want users to paste a code manually:
              <input
                type="text"
                placeholder="Referral code (optional)"
                value={referralCode}
                onChange={(e) => setManualRef(e.target.value)}
                className="w-full px-8 py-4 mb-6 rounded-lg border bg-gray-100 focus:outline-none"
              /> */}

              <button type="submit" className="w-full py-4 rounded-lg bg-gradient-to-r from-green-600 to-blue-400 text-white font-semibold">
                Sign Up
              </button>
            </form>

            <p className="mt-6 text-xs text-gray-600 text-center">
              Already have an account?{' '}
              <span
                onClick={() =>
                  router.push(
                    `/auth/login${
                      callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''
                    }`
                  )
                }
                className="ml-1 text-primary hover:underline cursor-pointer"
              >
                Log in
              </span>
            </p>
          </div>
        </div>

        {/* Right-side illustration */}
        <div className="flex-1 bg-green-100 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
            <Image
              src="/auth/login.png"
              alt="ZestLead Signup Visual"
              width={2500}
              height={2500}
              priority
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
