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
import { useRouter } from "next/router";
import { useState } from "react";

type PlanKey = "STARTER" | "GROWTH" | "PRO";

const toPlanKey = (name: string): PlanKey => {
  const v = name.toUpperCase();
  if (v.includes("PRO")) return "PRO";
  if (v.includes("GROWTH")) return "GROWTH";
  return "STARTER";
};

const PricingSection = () => {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);

  const startCheckout = async (planKey: PlanKey) => {
    try {
      setLoadingPlan(planKey);
      const resp = await fetch("/api/stripe/create-subscription-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan: planKey, annual: false }) // set true if you add an annual toggle here
      });

      if (resp.status === 401) {
        const cb = encodeURIComponent(router.asPath || "/pricing");
        router.push(`/auth/login?callbackUrl=${cb}`);
        return;
      }

      const data = await resp.json();
      if (!resp.ok || !data?.url) throw new Error(data?.error || "Checkout failed");
      window.location.href = data.url; // Stripe Hosted Checkout
    } catch (e: any) {
      alert(e.message || "Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "month",
      description: "Access the marketplace and pay full price per lead.",
      features: [
        "Standard marketplace access",
        "Pay full price per lead",
        "Basic filters (location, property type)",
        "Email lead alerts"
      ],
      popular: false,
      variant: "outline" as const,
      icon: <Zap className="w-5 h-5 text-primary" />
    },
    {
      name: "Growth",
      price: "$129",
      period: "month",
      description: "Priority access + 10% off all lead purchases.",
      features: [
        "10% discount on all leads",
        "Priority access (~30 mins earlier)",
        "Enhanced filters (budget, buyer/seller, intent)",
        "AI smart lead recommendations"
      ],
      popular: true,
      variant: "hero" as const,
      icon: <Briefcase className="w-5 h-5 text-white" />
    },
    {
      name: "Pro",
      price: "$299",
      period: "month",
      description: "Early access + 20% off, advanced scoring & CRM integrations.",
      features: [
        "20% discount on all leads",
        "Early access (~2 hours earlier)",
        "Advanced lead scoring & insights",
        "CRM integrations (Zoho, HubSpot, Salesforce)",
        "Pipeline management dashboard"
      ],
      popular: false,
      variant: "accent" as const,
      icon: <Building2 className="w-5 h-5 text-primary" />
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your{" "}
            <span
              className="bg-clip-text text-transparent inline-block"
              style={{
                background:
                  "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Subscription
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Subscribe for access, tools, priority—and buy leads on demand. No free leads; pay-per-lead with plan-based discounts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const key = toPlanKey(plan.name);
            const isLoading = loadingPlan === key;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                className={`relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                  plan.popular
                    ? "gradient-card border-primary/50 shadow-lg"
                    : "gradient-card border-white/20"
                }`}
              >
                {plan.popular && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    animate={{ scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 gradient-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </motion.div>
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
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="flex items-center gap-3"
                      whileHover={{ scale: 1.02, x: 4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full ${plan.popular ? "bg-primary text-white hover:brightness-110" : ""}`}
                  size="lg"
                  disabled={isLoading}
                  onClick={() => startCheckout(key)}
                >
                  {isLoading ? "Redirecting…" : plan.popular ? "Get Started" : "Choose Plan"}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-muted-foreground mb-4">
            All plans include dashboard access and refunds on invalid/unreachable leads.
          </p>
          <Button variant="ghost" className="text-primary hover:text-primary/80" onClick={() => router.push("/pricing")}>
            Compare Plans →
          </Button>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="text-muted-foreground mb-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-2">
              <Verified className="w-4 h-4 text-primary" /> Risk-Free: Refund if a lead is invalid or unreachable.
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-muted">
              <Lock className="w-4 h-4 text-primary" />
              SSL Secured Checkout
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-muted">
              <CreditCard className="w-4 h-4 text-primary" />
              Stripe Verified
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-muted">
              <RotateCcw className="w-4 h-4 text-primary" />
              Refunds on Bad Leads
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
