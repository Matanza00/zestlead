import { Badge } from "@/components/ui2/badge";
import {
  Home,
  MapPin,
  DollarSign,
  UserCheck,
  CheckCircle2,
  Rocket,
  Clock,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Home className="w-8 h-8 text-primary" />,
      title: "Verified Real Estate Leads",
      description: "Access a steady stream of buyer and seller leads, verified for accuracy and high intent across the U.S.",
      badge: "Trusted"
    },
    {
      icon: <UserCheck className="w-8 h-8 text-primary" />,
      title: "Agent-Only Marketplace",
      description: "Exclusively built for real estate professionals — connect with serious clients ready to act.",
      badge: "Exclusive"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-primary" />,
      title: "Affordable & Flexible Pricing",
      description: "Only pay for what you need. ZestLead’s credit-based model keeps your cost per lead lower than competitors.",
      badge: "Affordable"
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Location-Based Filters",
      description: "Find leads by city, zip code, or region so you can dominate your local real estate market.",
      badge: "Local"
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Fast Lead Delivery",
      description: "Leads are delivered instantly into your dashboard, ready to contact, tag, and close.",
      badge: "Fast"
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
      title: "Lead Quality Score",
      description: "Each lead is scored based on activity and readiness to convert — so you can focus on hot leads first.",
      badge: "AI-Powered"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Performance Insights",
      description: "Track conversion rates and ROI from every lead source to make smarter marketing decisions.",
      badge: "Analytics"
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Live Support & Updates",
      description: "Talk to a real person when you need help. Our team ensures your lead feed stays fresh and active.",
      badge: "Support"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Top Agents Use{" "}
            <span
              className="bg-clip-text text-transparent inline-block"
              style={{
                background: "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              ZestLead
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our most powerful real estate lead generation tools — trusted by brokers, solo agents, and growing teams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.2, ease: "easeOut" }}
                whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 24px rgba(0, 10, 10, 0.2)"
                }}
                className="group p-6 rounded-xl gradient-card border border-white/10 backdrop-blur-sm hover:shadow-lg transition-all duration-50"
                >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.1, type: "spring", stiffness: 150 }}
                    className="p-3 rounded-lg gradient-primary text-primary-foreground group-hover:scale-110 transition-transform duration-50"
                >
                    {feature.icon}
                </motion.div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                </p>
            </motion.div>

          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
