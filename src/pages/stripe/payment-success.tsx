// pages/stripe/payment-success.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckCircle2, Sparkles, Clock, ArrowRight } from 'lucide-react';

export default function PaymentSuccess(props) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const tick = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    const timer = setTimeout(() => {
      router.push('/user/my-leads'); // target: My Leads page
    }, 5000);

    return () => {
      clearInterval(tick);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0ea5e9]/10 via-white to-[#22c55e]/10 flex items-center justify-center px-4 py-10">
      {/* Card */}
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="relative">
              <CheckCircle2 className="h-12 w-12 text-green-600" aria-hidden="true" />
              <Sparkles className="h-5 w-5 text-emerald-400 absolute -top-2 -right-2" aria-hidden="true" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Successful</h1>
            <p className="text-gray-600 mt-1">
              Thank you! Your purchase has been processed and your leads are now available.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Countdown + Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-green-600" />
              <span>Redirecting to <span className="font-medium text-gray-800">My Leads</span> in</span>
            </div>
            <span className="text-base font-semibold text-green-700 tabular-nums">{seconds}s</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all"
              style={{ width: `${((5 - seconds) / 5) * 100}%` }}
            />
          </div>

          <p className="text-xs text-gray-500">
            You can also jump ahead now:
          </p>

          {/* Primary CTA */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/user/my-leads"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              View My Leads <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/leads"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-100 text-gray-800 px-5 py-2.5 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Browse More Leads
            </Link>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-gray-400 mt-6">
          Having trouble? If you’re not redirected automatically, click “View My Leads”.
        </p>
      </div>
    </div>
  );
}
