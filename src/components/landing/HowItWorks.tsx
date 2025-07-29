import { Button } from "@/components/ui2/button";
import { ArrowRight, Search, ShoppingCart, Users, BarChart } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Browse Verified Leads",
      description: "Use filters to explore high-quality real estate leads by location, type, and price range. All leads are verified and updated daily.",
      image: "/ZestLead/Lead Marketplace-Grid.png",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Purchase Leads",
      description: "Select and purchase the leads you want with our flexible credit system and secure checkout process.",
      image: "/ZestLead/Checkout Page - Payment.png",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
            title: "Manage & Contact",
      description: "Organize your purchased leads inside your dashboard, tag and filter contacts, and start reaching out to motivated buyers and sellers.",
      image: "/ZestLead/Lead Marketplace-List.png",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <BarChart className="w-8 h-8" />,
title: "Track Performance",
      description: "Monitor your lead conversion rates, outreach history, and ROI with built-in analytics and activity logs.",
      image: "/ZestLead/Dashboard.png",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple steps to get you generating leads in no time
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-12 mb-20 last:mb-0`}
            >
              {/* Content */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
                >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.1, type: "spring", stiffness: 150 }}
                    className={`p-4 rounded-xl bg-gradient-to-r ${step.color} text-white mb-6 inline-block`}
                >
                    {step.icon}
                </motion.div>

                {/* Step Number */}
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-3xl font-bold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-accent" />
                </div>

                <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {step.description}
                </p>

                <Button variant="outline" className="group">
                    Learn More
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                </motion.div>


              {/* Image */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: index % 2 === 0 ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 + 0.1, duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
                >
                <div className="float-3d rounded-xl overflow-hidden gradient-card p-4 backdrop-blur-sm border border-white/20">
                    <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto rounded-lg"
                    />
                </div>
              </motion.div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;