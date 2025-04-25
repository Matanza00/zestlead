import { useEffect } from "react";
import { useRouter } from 'next/router';

// pages/payment-cancelled.tsx
export default function PaymentCancelled(props) {
  const router = useRouter();

  useEffect(() => {
      const timer = setTimeout(() => {
        router.push('/user/leads'); // 👈 Change to actual customer lead page
      }, 5000); // Redirect after 5 seconds
  
      return () => clearTimeout(timer);
    }, [router]);

    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 text-center px-4">
        <div className="bg-white p-10 rounded shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Payment Cancelled</h1>
          <p className="text-gray-700">Your payment was not completed. You can try again anytime.</p>
        </div>
      </div>
    );
  }
  