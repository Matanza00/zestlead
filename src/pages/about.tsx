import Head from 'next/head';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  DollarSign,
  BarChart2,
  Zap,
  Globe,
  Building2,
  Star,
  MapPin
} from 'lucide-react';
import Header from '@/components/landing/Header';
import { Button } from '@/components/ui2/button';
import { motion, easeOut , Variants } from "framer-motion";

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

export default function AboutPage() {
  return (
    <>
        <Header />
      <Head>
        <title>About Us | ZestLead</title>
      </Head>

      <div className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 p-8 sm:p-12">
          <h1
            className="text-4xl font-extrabold text-center mb-6
              [font-family:'Plus_Jakarta_Sans']
              bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
              bg-clip-text text-transparent"
          >
            Built to Empower Real Estate Agents with Quality Leads That Close
          </h1>

          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            ZestLead is the #1 platform for discovering, buying, and managing high-intent real estate leads—trusted by thousands of brokers, agents, and growing real estate teams across the U.S. We’re redefining lead generation with curated, verified, and affordable leads—delivered in real-time and backed by transparent support.
          </p>

          {/* Mission */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-4 bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)] bg-clip-text text-transparent">
                Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                At ZestLead, we believe agents deserve better than recycled data and vague cold leads. Our mission is simple:
                <span className="font-semibold text-gray-900"> empower real estate professionals with verified, exclusive leads that convert.</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-800">
                <div className="rounded-xl border border-gray-200 shadow-md p-5 bg-white hover:shadow-lg transition">
                <ShieldCheck className="w-6 h-6 text-green-600 mb-3" />
                <h3 className="font-semibold mb-1">Pre-Qualified & Verified</h3>
                <p>All leads are checked for buying or selling intent before they reach your inbox.</p>
                </div>
                <div className="rounded-xl border border-gray-200 shadow-md p-5 bg-white hover:shadow-lg transition">
                <Zap className="w-6 h-6 text-yellow-500 mb-3" />
                <h3 className="font-semibold mb-1">Delivered Instantly</h3>
                <p>Our systems deliver hot leads in real-time—so you can act fast and win faster.</p>
                </div>
                <div className="rounded-xl border border-gray-200 shadow-md p-5 bg-white hover:shadow-lg transition">
                <MapPin className="w-6 h-6 text-blue-500 mb-3" />
                <h3 className="font-semibold mb-1">Location-Filtered</h3>
                <p>Target by state, city, or zip to get leads where your business thrives most.</p>
                </div>
                <div className="rounded-xl border border-gray-200 shadow-md p-5 bg-white hover:shadow-lg transition">
                <BarChart2 className="w-6 h-6 text-indigo-500 mb-3" />
                <h3 className="font-semibold mb-1">Tools that Convert</h3>
                <p>From filtering to CRM sync—ZestLead gives you control over every lead.</p>
                </div>
            </div>
            </section>


          {/* Why ZestLead */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Why ZestLead?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div>
                  <strong className="block font-medium">Verified Leads Only</strong>
                  Every lead is validated for intent and checked against the MLS.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <strong className="block font-medium">Agent-First Marketplace</strong>
                  Built exclusively for licensed agents and professionals.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-primary" />
                <div>
                  <strong className="block font-medium">Affordable & Transparent</strong>
                  No hidden fees. Pay for only what you need.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart2 className="w-6 h-6 text-primary" />
                <div>
                  <strong className="block font-medium">Actionable Insights</strong>
                  Track performance, filter by location, and stay organized.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-primary" />
                <div>
                  <strong className="block font-medium">Real-Time Delivery</strong>
                  Never miss a hot lead. Delivered instantly.
                </div>
              </div>
            </div>
          </section>

          {/* Who We Serve */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-4 bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)] bg-clip-text text-transparent">
                Who We Serve
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-3xl">
                Whether you're an independent Realtor building your pipeline or a broker leading a 50-agent team—ZestLead is built to fuel your growth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-800">
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 hover:shadow-md transition">
                <Users className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-medium mb-1">Solo Agents</h3>
                <p>Break through the noise with leads tailored to your zip code and specialty.</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 hover:shadow-md transition">
                <Building2 className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-medium mb-1">Brokerages & Teams</h3>
                <p>Get scalable lead distribution and tools to track agent success.</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 hover:shadow-md transition">
                <Globe className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-medium mb-1">Multi-Market Professionals</h3>
                <p>Operate across regions? ZestLead delivers geo-targeted leads wherever you work.</p>
                </div>
            </div>

            <div className="mt-10">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Top Active Markets</h4>
                <ul className="flex flex-wrap gap-4 text-gray-700 text-sm">
                {['New York', 'California', 'Texas', 'Illinois', 'Florida'].map((location) => (
                    <li key={location} className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-blue-500" /> {location}
                    </li>
                ))}
                </ul>
            </div>
            </section>


          {/* Our Story */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700">
              ZestLead was founded by real estate professionals and tech veterans frustrated by overpriced and underperforming lead platforms. We believed there was a better way to connect agents with serious buyers and sellers—without the fluff or friction. Today, ZestLead continues as a results-driven platform helping agents close more deals in less time.
            </p>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Start Closing More Deals with ZestLead</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Whether you're just starting out or leading a high-performing team, ZestLead gives you verified leads, filters, and tools to win.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
             {/* CTA Buttons with <Link> */}
<motion.div
  variants={fadeUp}
  custom={0.6}
  className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-12"
>
  <Link href="#about" passHref>
    <Button
      size="lg"
      className="text-lg px-8 py-4 font-semibold shadow-md text-white hover:scale-105 hover:shadow-lg transition"
      style={{
        background:
          "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)"
      }}
    >
      Learn More About Us
    </Button>
  </Link>

  <Link href="/leads" passHref>
    <Button
      size="lg"
      className="text-lg px-8 py-4 bg-accent text-accent-foreground font-semibold shadow-md hover:brightness-110 hover:shadow-lg transition"
    >
      Try 5 Leads Risk-Free
    </Button>
  </Link>

  <Link href="/demo" passHref>
    <Button
      variant="ghost"
      size="lg"
      className="text-lg px-6 py-4 text-muted-foreground hover:text-primary transition"
    >
      Request a Demo
    </Button>
  </Link>
</motion.div>
            </div>
            
          </section>
        </div>
      </div>
    </>
  );
}
