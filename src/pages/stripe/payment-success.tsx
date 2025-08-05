// pages/stripe/payment-success.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PaymentSuccess(props) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/user/my-leads'); // 👈 Change to actual customer lead page
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 text-center px-4">
      <div className="bg-white p-10 rounded shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
        <p className="text-gray-700 mb-2">Thank you! Your purchase has been processed.</p>
        <p className="text-sm text-gray-500">Redirecting to your leads in 5 seconds...</p>
      </div>
      <p className="mt-4 text-sm">
        <a
          href="/user/my-leads"
          className="text-green-700 hover:underline"
        >
          Click here if you're not redirected
        </a>
      </p>
    </div>
  );
}
