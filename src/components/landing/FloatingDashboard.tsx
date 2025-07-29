import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const dashboardSlides = [
  {
    src: "/ZestLead/Dashboard-Analytic.png",
    alt: "Real Estate CRM Dashboard",
    title: "Lead Pipeline & Analytics",
    description:
      "Track every buyer and seller lead in real time. Monitor activity, filter by engagement, and measure conversion performance inside your intuitive ZestLead dashboard."
  },
  {
    src: "/ZestLead/Marketplace.png",
    alt: "Lead Marketplace",
    title: "Exclusive US-Based Leads",
    description:
      "Gain instant access to our daily-updated marketplace of verified real estate leads. Filter by city, zip code, or price range—available exclusively to licensed agents."
  },
  {
    src: "/ZestLead/MarketPlace-Grid.png",
    alt: "Lead Purchase Workflow",
    title: "Buy & Convert Seamlessly",
    description:
      "Browse, purchase, and contact real estate leads in seconds. No contracts, no middlemen—just high-converting leads delivered straight to your CRM."
  }
];

const FloatingDashboard = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % dashboardSlides.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + dashboardSlides.length) % dashboardSlides.length);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = dashboardSlides[index];

  return (
    <section className="relative py-24 bg-background overflow-hidden border-t border-border">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore the ZestLead{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background:
                  "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Lead Platform
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to manage, filter, purchase, and close high-converting real estate
            leads—powered by a single dashboard built for agents.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-10 transition-all duration-500 ease-in-out">
          {/* Image */}
          <div className="w-full md:w-1/2">
           <motion.div
            className="rounded-xl overflow-hidden shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,10,10,0.3)]"
            whileHover={{
                scale: 1.03,
                rotateX: -4,
                rotateY: 4,
                transition: { type: "spring", stiffness: 180, damping: 20 }
            }}
            style={{
                background: "linear-gradient(120deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))"
            }}
            >
            <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
            />
            </motion.div>

          </div>

          {/* Text */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h3 className="text-3xl font-semibold mb-4">{slide.title}</h3>
            <p className="text-muted-foreground text-md mb-6">{slide.description}</p>

            <ul className="text-sm space-y-2 mb-6">
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="text-primary w-4 h-4" />
                No contracts — pay as you go
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="text-primary w-4 h-4" />
                Updated daily by our in-house team
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="text-primary w-4 h-4" />
                Filter leads by zip code, value, and type
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="text-primary w-4 h-4" />
                Integrated follow-ups & remark tools
              </li>
            </ul>

            {/* Arrows */}
            <div className="flex gap-3">
              <button
                onClick={prev}
                className="p-2 rounded-full border border-border hover:bg-muted transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="p-2 rounded-full border border-border hover:bg-muted transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating background blur */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float z-0" />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float z-0"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </section>
  );
};

export default FloatingDashboard;
