// components/PricingSection.tsx
'use client';

import { Button } from "@/components/ui2/button";
import { Badge } from "@/components/ui2/badge";
import {
  Zap,
  Briefcase,
  Building2,
  Check,
  Lock,
  CreditCard,
  RotateCcw,
  Verified
} from "lucide-react";
import { motion } from "framer-motion";

type PlanKey = 'STARTER' | 'GROWTH' | 'ENTERPRISE';

const plans: {
  key: PlanKey;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  icon: React.ReactNode;
}[] = [
  {
    key: 'STARTER',
    name: "Starter Agent",
    price: "$49",
    period: "month",
    description: "Perfect for new agents looking to build a steady pipeline.",
    features: [
      "25 Verified Buyer/Seller Leads",
      "Location-Based Filters",
      "Basic Contact Management",
      "Lead Quality Score",
      "Email Support"
    ],
    popular: false,
    icon: <Zap className="w-5 h-5 text-primary" />
  },
  {
    key: 'GROWTH',
    name: "Growth Broker",
    price: "$199",
    period: "month",
    description: "Most popular plan for growing agents and small teams.",
    features: [
      "100 Verified Real Estate Leads",
      "Advanced Filters + Tagging",
      "Custom Lead Notes & Status",
      "Performance Analytics",
      "Priority Email Support"
    ],
    popular: true,
    icon: <Briefcase className="w-5 h-5 text-white" />
  },
  {
    key: 'ENTERPRISE',
    name: "Enterprise Team",
    price: "$499",
    period: "month",
    description: "Built for large teams and brokerages that need volume and customization.",
    features: [
      "Unlimited Leads Per Month",
      "API Access for CRM Integration",
      "White-label Dashboards",
      "Team Collaboration Tools",
      "Dedicated Account Manager",
      "24/7 Premium Support"
    ],
    popular: false,
    icon: <Building2 className="w-5 h-5 text-primary" />
  }
];

export default function PricingSection({
  subscribed = false,
  onSelectPlan
}: {
  subscribed?: boolean;
  onSelectPlan?: (planKey: PlanKey) => void;
}) {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* ... header omitted for brevity ... */}

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              className={`relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                plan.popular
                  ? "gradient-card border-primary/50 shadow-lg"
                  : "gradient-card border-white/20"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 gradient-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {plan.icon}
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.02, x: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feat}</span>
                  </motion.li>
                ))}
              </ul>

              {subscribed ? (
                <Button variant="outline" className="w-full opacity-60" disabled>
                  Already Subscribed
                </Button>
              ) : (
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full ${plan.popular ? "bg-primary text-white hover:brightness-110" : ""}`}
                  size="lg"
                  onClick={() => onSelectPlan?.(plan.key)}
                >
                  {plan.popular ? "Get Started" : "Buy Plan"}
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* ... footer omitted for brevity ... */}
      </div>
    </section>
  );
}
