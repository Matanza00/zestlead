import Header from '@/components/landing/Header';
import Head from 'next/head';

export default function TermsOfService() {
  return (
    <>
    <Header />
      <Head>
        <title>Terms of Service | ZestLead</title>
      </Head>
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-xl border border-gray-200">
          <h1
            className="text-4xl font-extrabold tracking-tight mb-3 
              [font-family:'Plus_Jakarta_Sans'] 
              bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
              bg-clip-text text-transparent"
          >
            ZestLead Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: July 31, 2025</p>

          {[
            ['1. Eligibility', 'You must be at least 18 years old and a licensed real estate professional, broker, or investor authorized to engage in lead-based outreach.'],
            ['2. Account Registration', 'You agree to provide accurate and current information and maintain the security of your account credentials.'],
            ['3. Services Offered', 'ZestLead provides a platform for discovering, purchasing, and managing real estate leads along with analytics and support.'],
            ['4. Lead Access & Usage', 'Leads may only be used for legitimate business purposes. Redistribution or resale is prohibited.'],
            ['5. Payment & Billing', 'Subscriptions are billed based on plan selection. Payments are non-refundable unless covered under our refund policy.'],
            ['6. Refund Policy', 'Refunds/credits may be issued for duplicate, invalid, or already-listed leads if requested within 7 days.'],
            ['7. Intellectual Property', 'All platform content, branding, and data systems are owned by ZestLead and protected by applicable laws.'],
            ['8. Termination', 'We reserve the right to suspend or terminate accounts for misuse or policy violations.'],
            ['9. Disclaimers', 'ZestLead makes no guarantee that all leads will convert. Success depends on your follow-up and market factors.'],
            ['10. Governing Law', 'These Terms are governed by the laws of the United States and the State of [Your State Here].'],
            ['11. Contact', (
              <>Questions? Email us at{' '}
                <a href="mailto:support@zestlead.com" className="text-blue-600 underline">support@zestlead.com</a>.
              </>
            )],
          ].map(([title, content], idx) => (
            <div key={idx} className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
