import { motion, easeOut, Variants } from "framer-motion";
import { Button } from "@/components/ui2/button";
import { Play } from "lucide-react";
import Image from "next/image";

// Animation variants
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: easeOut },
  }),
};

const headingContainer = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

const headingItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: easeOut } },
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[86vh] flex items-center overflow-hidden">
      {/* Background gradient wash */}
      <div className="absolute inset-0 gradient-hero opacity-50" />

      <motion.div
        className="container mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* 2-col layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Copy + CTAs */}
          <div className="text-left max-w-2xl mx-auto md:mx-0">
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              animate="show"
              className="inline-flex items-center px-4 py-2 rounded-full gradient-card border border-white/20 text-sm font-medium mb-6"
            >
              🏡 Trusted Real Estate Leads — Updated Daily by Real Humans
            </motion.div>

            {/* Heading */}
            <motion.div variants={headingContainer} className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <motion.div variants={headingItem}>Discover & Convert</motion.div>
              <motion.div variants={headingItem}>
                <span
                  className="font-bold"
                  style={{
                    background:
                      "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
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
              className="text-lg md:text-xl text-muted-foreground mb-8"
            >
              ZestLead is the #1 platform in the US for buying regularly updated, affordable, and
              verified real estate leads — curated to help realtors grow faster.
            </motion.p>

            {/* CTAs (unchanged) */}
            <motion.div
              variants={fadeUp}
              custom={0.6}
              className="flex flex-col sm:flex-row flex-wrap gap-4 mb-2"
            >
              <Button
                size="lg"
                className="text-lg px-8 py-4 font-semibold shadow-md text-white hover:scale-105 hover:shadow-lg transition"
                style={{
                  background:
                    "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)",
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
            <motion.div variants={fadeUp} className="mt-8 grid grid-cols-3 gap-6 text-center md:text-left">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-600">25,000+</div>
                <div className="text-muted-foreground text-sm">Verified Buyer & Seller Leads</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-600">Up to 70% Cheaper</div>
                <div className="text-muted-foreground text-sm">Than Traditional Marketplaces</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-600">100%</div>
                <div className="text-muted-foreground text-sm">US-Based, Real Estate Focused</div>
              </div>
            </motion.div>
          </div>

         {/* Right: 3D Mockup (larger) */}
          <div className="relative hidden md:flex items-center justify-center">
            {/* Soft ellipse shadow behind (scaled up) */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2
                            w-[640px] lg:w-[780px] xl:w-[960px] 2xl:w-[1120px]
                            h-[220px] rounded-[999px] bg-black/30 blur-[80px] opacity-40" />

            {/* Perspective wrapper */}
            <div className="relative overflow-visible" style={{ perspective: "1600px" }}>
              <motion.div
                initial={{ rotateX: 12, rotateY: -22, rotateZ: 0, y: 10, opacity: 0 }}
                animate={{ rotateX: 12, rotateY: -22, rotateZ: 0, y: 0, opacity: 1 }}
                whileHover={{ rotateX: 10, rotateY: -18, y: -4 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="md:w-[640px] lg:w-[780px] xl:w-[960px] 2xl:w-[1120px]"
              >
                {/* Subtle float */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotateZ: [0, -0.2, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <Image
                    src="/Zestlead/zestlead-mockup.png"
                    alt="ZestLeads dashboard preview"
                    priority
                    width={1920}
                    height={1200}
                    className="w-full h-auto drop-shadow-2xl select-none pointer-events-none"
                  />

                  {/* subtle rim + glow (scaled up) */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                  <div className="pointer-events-none absolute -inset-10 rounded-[32px]
                                  bg-gradient-to-tr from-[#82E15A]/20 to-[#0A7894]/20
                                  blur-3xl opacity-60" />
                </motion.div>
              </motion.div>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
