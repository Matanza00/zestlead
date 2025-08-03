'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) router.push('/auth/login');
    else alert('Signup failed');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <h1
              className="pt-8 text-center text-7xl font-bold tracking-tight align-center
              [font-family:'Plus_Jakarta_Sans'] font-semibold
              bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
              bg-clip-text [-webkit-background-clip:text]
              text-transparent [-webkit-text-fill-color:transparent] text-shadow-lg/5"
            >
              ZestLeads
            </h1>
          </div>
          <div className="mt-12 flex flex-col items-center">
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="w-full max-w-xs font-bold shadow-xl rounded-lg py-3 bg-green-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow"
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
                  <span className="ml-4">Sign Up with Google</span>
                </button>
              </div>

              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign up with email
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-4"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-4"
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-4"
                />
                <button
                  type="submit"
                  className="z-10 tracking-wide font-semibold bg-[radial-gradient(115.64%_219.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)] text-white w-full py-4 rounded-lg shadow-xl/15 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <span className="ml-1">Sign Up</span>
                </button>

                <p className="mt-6 text-xs text-gray-600 text-center">
                  Already have an account?
                  <span
                    onClick={() => router.push('/auth/login')}
                    className="ml-1 text-primary hover:underline cursor-pointer"
                  >
                    Log in
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 bg-green-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
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
