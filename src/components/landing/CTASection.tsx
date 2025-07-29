import { motion } from "framer-motion";
import { easeOut, easeInOut } from "framer-motion";
import { Button } from "@/components/ui2/button";
import { ArrowRight, PhoneCall } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }
};

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-hero opacity-30" />

      <motion.div
        className="absolute top-10 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: easeInOut }}
      />

      <motion.div
        className="absolute bottom-10 right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: easeInOut }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-card border border-white/20 text-sm font-medium mb-6"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            🚀 Get High-Intent Real Estate Leads — Instantly
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-6"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            Start Closing More{" "}
            <span
              className="bg-clip-text text-transparent inline-block"
              style={{
                background:
                  "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Deals Today
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            Join 10,000+ real estate agents using ZestLead to buy verified leads, grow their
            pipeline, and close faster — all without a long-term contract.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            <Button
              variant="default"
              size="lg"
              className="text-lg px-8 py-4 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-primary text-white"
            >
              Browse Leads <ArrowRight className="ml-2" />
            </Button>
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-accent text-accent-foreground font-semibold shadow-md hover:brightness-110 hover:shadow-lg transition-all duration-300"
            >
              <PhoneCall className="mr-2" /> Request Demo
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-sm">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-sm">100% US-Based Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-sm">Cancel Anytime</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
