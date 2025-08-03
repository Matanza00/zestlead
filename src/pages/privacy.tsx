import Header from '@/components/landing/Header';
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
    <Header />
      <Head>
        <title>Privacy Policy | ZestLead</title>
      </Head>
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-xl border border-gray-200">
          <h1
            className="text-4xl font-extrabold tracking-tight mb-3 
              [font-family:'Plus_Jakarta_Sans'] 
              bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
              bg-clip-text text-transparent"
          >
            ZestLead Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: July 31, 2025</p>

          {[
            ['1. Information We Collect', 'We collect information you provide (e.g., name, contact info, billing details) and technical data (IP, session logs).'],
            ['2. How We Use Your Information', 'Your data is used for account management, service delivery, performance analysis, and communication.'],
            ['3. Sharing & Disclosure', 'We never sell your data. We share it only with secure, compliant third-party services (e.g., Stripe, analytics).'],
            ['4. Cookies & Tracking', 'We use cookies for session management and performance insights. You can disable cookies in your browser settings.'],
            ['5. Data Storage & Security', 'Your data is encrypted in transit and at rest. All payments are processed through PCI-compliant providers.'],
            ['6. Your Rights', (
              <>You may request to view, modify, or delete your data by contacting us at{' '}
                <a href="mailto:privacy@zestlead.com" className="text-blue-600 underline">privacy@zestlead.com</a>.
              </>
            )],
            ['7. Children\'s Privacy', 'ZestLead is not intended for users under 18. We do not knowingly collect data from minors.'],
            ['8. Policy Updates', 'We may update this policy periodically. All changes will be posted on this page.'],
            ['9. Contact', (
              <>For privacy-related inquiries, email us at{' '}
                <a href="mailto:privacy@zestlead.com" className="text-blue-600 underline">privacy@zestlead.com</a>.
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
