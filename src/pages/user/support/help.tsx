'use client';
import UserLayout from '@/components/CombinedNavbar';
import { faqList as FaqList } from '@/lib/data/faqList';
import { useState } from 'react';

export default function HelpFaqPage(props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filteredFaqs = FaqList.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-zinc-800 mb-2">Help & FAQs</h1>
        <p className="text-zinc-600 mb-6">
          Find answers to your questions or get support.
        </p>

        <input
          type="text"
          placeholder="Search for a question..."
          className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
              <button
                className="w-full text-left p-4 font-semibold text-zinc-800 hover:bg-zinc-100"
                onClick={() => setExpanded(expanded === index ? null : index)}
              >
                {faq.question}
              </button>
              {expanded === index && (
                <div className="px-4 pb-4 text-zinc-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Need more help?</h2>
          <p className="text-sm text-blue-700 mb-4">
            If your issue isn’t listed above, scroll down and message us directly through the chat widget below.
            Our support team will respond as soon as possible.
          </p>
          <p className="text-sm text-blue-700">
            You can also email support at <strong>help@zestleads.com</strong>.
          </p>
        </div>
      </div>
    </UserLayout>
  );
}
