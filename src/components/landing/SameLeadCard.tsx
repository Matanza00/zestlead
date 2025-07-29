import {
  User,
  Phone,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Map,
  ChevronRight
} from "lucide-react";

import { motion } from "framer-motion";

const SampleLeadCard = () => {
  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h3
          className="text-3xl font-bold mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Sample Real Estate Lead
        </motion.h3>

        <motion.div
          className="bg-white border border-border rounded-xl shadow-md grid lg:grid-cols-2 gap-8 p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left Side */}
          <div className="flex flex-col gap-6">
            <div className="space-y-1">
              <h4 className="text-xl font-semibold mb-2">Details</h4>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4 text-primary" />
                  <span><strong>Name:</strong> Bob Smith</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span><strong>Phone:</strong> +1 (202) 555-0187</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Home className="w-4 h-4 text-primary" />
                  <span><strong>Type:</strong> House</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span><strong>Area:</strong> California</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span><strong>Value:</strong> $60K–120K</span>
                </div>
              </div>

              <div className="mt-4 text-sm">
                <strong>Address:</strong>{" "}
                <span className="text-muted-foreground">
                  116–100 S Dacotah St, Los Angeles, CA 90063, USA
                </span>
              </div>

              <button
                className="mt-2 inline-flex items-center text-sm px-4 py-2 rounded-full font-medium gap-2 border"
                style={{
                  borderColor: "#637186ff",
                  backgroundColor: "white",
                  boxShadow: "inset 0px 0px 4px rgba(255, 255, 255, 0.15)"
                }}
              >
                <Phone className="w-4 h-4 text-gray-700" />
                <span
                  className="font-medium"
                  style={{
                    background:
                      "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block"
                  }}
                >
                  Call Now
                </span>
              </button>
            </div>

            {/* Remarks */}
            <div>
              <label className="block font-medium text-sm mb-1">Remarks</label>
              <textarea
                rows={3}
                placeholder="Add your remarks or notes regarding this lead here"
                className="w-full rounded-md border border-border px-4 py-2 text-sm bg-muted resize-none"
              />
            </div>

            {/* Follow Up Reminder */}
            <div className="mt-3 flex gap-2">
              <button className="text-sm px-4 py-2 border border-muted rounded-md text-muted-foreground hover:bg-muted transition">
                Reset
              </button>

              <button
                className="text-sm px-4 py-2 text-white rounded-full font-medium flex items-center justify-center gap-2 shadow-sm"
                style={{
                  background:
                    "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)",
                  boxShadow: "inset 0px 0px 4px rgba(255, 255, 255, 0.15)"
                }}
              >
                View Leads
              </button>
            </div>
          </div>

          {/* Right: Map */}
          <div className="w-full h-full">
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=116+S+Dacotah+St+Los+Angeles,CA&zoom=15&size=600x400&markers=color:red%7C116+S+Dacotah+St+Los+Angeles,CA&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                alt="Sample Lead Map"
                className="w-full h-full object-cover"
              />
              <a
                href="https://maps.google.com/?q=116+S+Dacotah+St+Los+Angeles,CA"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 px-3 py-1 text-sm bg-white text-primary rounded-full border border-primary shadow hover:brightness-105 inline-flex items-center"
              >
                <Map className="w-4 h-4 mr-1" />
                See Google Maps
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SampleLeadCard;
