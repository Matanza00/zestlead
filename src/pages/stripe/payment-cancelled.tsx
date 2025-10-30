// pages/payment-cancelled.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { XCircle, AlertTriangle, Clock, ArrowLeft, RefreshCcw } from 'lucide-react';

export default function PaymentCancelled(props) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const tick = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    const timer = setTimeout(() => {
      router.push('/user/leads'); // 👈 actual customer lead page
    }, 5000);

    return () => {
      clearInterval(tick);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f87171]/10 via-white to-[#facc15]/10 flex items-center justify-center px-4 py-10">
      {/* Card */}
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="relative">
              <XCircle className="h-12 w-12 text-red-600" aria-hidden="true" />
              <AlertTriangle className="h-5 w-5 text-amber-400 absolute -top-2 -right-2" aria-hidden="true" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Cancelled</h1>
            <p className="text-gray-600 mt-1">
              Your payment was not completed. You can retry anytime to access your leads.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Countdown + Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-red-600" />
              <span>Redirecting back to <span className="font-medium text-gray-800">Leads</span> in</span>
            </div>
            <span className="text-base font-semibold text-red-700 tabular-nums">{seconds}s</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all"
              style={{ width: `${((5 - seconds) / 5) * 100}%` }}
            />
          </div>

          <p className="text-xs text-gray-500">
            You can also navigate directly now:
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/user/leads"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Back to Leads <ArrowLeft className="h-4 w-4" />
            </Link>

            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-100 text-gray-800 px-5 py-2.5 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Retry Payment <RefreshCcw className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-gray-400 mt-6">
          If you’re not redirected automatically, click “Back to Leads”.
        </p>
      </div>
    </div>
  );
}
