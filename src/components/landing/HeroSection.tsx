import { motion, easeOut , Variants } from "framer-motion";
import { Button } from "@/components/ui2/button";
import { Play } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: easeOut, // ✅ use imported easing
    }
  })
};


const headingContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const headingItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: easeOut, // this replaces "easeOut"
    }
  }
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-50" />

      {/* Floating blur elements */}
      {/* <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div> */}

      <motion.div
        className="container mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            animate="show"
            className="inline-flex items-center px-4 py-2 rounded-full gradient-card border border-white/20 text-sm font-medium mb-6"
          >
            🏡 Trusted Real Estate Leads — Updated Daily by Real Humans
          </motion.div>

          {/* Main heading */}
          <motion.div
            variants={headingContainer}

            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-center"
            >
            <motion.div variants={headingItem}>Discover & Convert</motion.div>
            <motion.div variants={headingItem}>
                <span
                className="font-bold"
                style={{
                    background:
                    "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block"
                }}
                >
                High-Intent Leads
                </span>
            </motion.div>
            <motion.div variants={headingItem}>in Real Estate</motion.div>
          </motion.div>


          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            custom={0.2}
            animate="show"
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            ZestLead is the #1 platform in the US for buying regularly updated, affordable, and
            verified real estate leads — curated to help realtors grow faster.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            custom={0.6}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              className="text-lg px-8 py-4 font-semibold shadow-md text-white hover:scale-105 hover:shadow-lg transition"
              style={{
                background:
                  "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)"
              }}
            >
              View Verified Leads Near You
            </Button>
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-accent text-accent-foreground font-semibold shadow-md hover:brightness-110 hover:shadow-lg transition"
            >
              Try 5 Leads Risk-Free
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-lg px-6 py-4 text-muted-foreground hover:text-primary transition"
            >
              Request a Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-8 text-center"
          >
            <div>
              <div className="text-3xl font-bold text-gray-500">25,000+</div>
              <div className="text-muted-foreground">Verified Buyer & Seller Leads</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-500">Up to 70% Cheaper</div>
              <div className="text-muted-foreground">Than Traditional Marketplaces</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-500">100%</div>
              <div className="text-muted-foreground">US-Based, Real Estate Focused</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
