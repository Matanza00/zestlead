import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Are ZestLead leads exclusive?",
    answer:
      "Yes. Every lead you purchase is removed from our marketplace and made exclusively yours. We do not resell leads — ever."
  },
  {
    question: "How fast do I get my leads?",
    answer:
      "Leads are delivered instantly to your dashboard with full contact information, tags, and lead scores."
  },
  {
    question: "What makes ZestLead different from Zillow or zBuyer?",
    answer:
      "ZestLead offers verified, exclusive leads with no contracts or reselling. Our leads are fresh, targeted, and backed by refund guarantees."
  },
  {
    question: "Can I filter leads by location or type?",
    answer:
      "Absolutely. Use filters like city, zip code, lead type (buyer/seller), budget, and timeline to find the most relevant opportunities."
  },
  {
    question: "What if a lead is fake or unreachable?",
    answer:
      "You're protected by our refund policy. If a lead is invalid or unreachable, request a refund — no questions asked."
  }
];

const FAQSection = () => {
  return (
    <section className="bg-background py-16 border-t border-border mt-8">
  <div className="container mx-auto px-4 max-w-5xl ">
    <h3 className="text-3xl font-bold mb-8 text-center">
      Frequently Asked Questions
    </h3>
    <div className="space-y-8">
      <div>
        <h4 className="font-semibold text-lg mb-1">
          Are ZestLead leads exclusive?
        </h4>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Yes. Every lead you purchase is removed from our marketplace and made exclusively yours. We do not resell leads — ever.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-lg mb-1">
          What makes ZestLead different from Zillow or zBuyer?
        </h4>
        <p className="text-muted-foreground text-sm leading-relaxed">
          ZestLead focuses on delivering real-time verified leads with exclusive access, flexible pricing, and no monthly contracts. Our platform is built for agents, not advertisers.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-lg mb-1">
          How fast do I get my leads?
        </h4>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Instantly. Once you complete your purchase, leads are delivered directly to your dashboard with full contact details and lead scores.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-lg mb-1">
            Can I filter leads by location or type?
        </h4>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Absolutely. Use filters like city, zip code, lead type (buyer/seller), budget, and timeline to find the most relevant opportunities.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-lg mb-1">
          What if a lead is fake or unreachable?
        </h4>
        <p className="text-muted-foreground text-sm leading-relaxed">
          You're protected by our refund policy. If a lead is invalid or unreachable, request a refund — no questions asked.
        </p>
      </div>
    </div>
  </div>
</section>
  );
};

export default FAQSection;
