import { motion } from "framer-motion";

const trustedLogos = [
  { name: "Inman", src: "/logos/inman.png" },
  { name: "RISMedia", src: "/logos/rismedia.png" },
  { name: "REALTOR", src: "/logos/realtor.svg" },
  { name: "Zillow", src: "/logos/zillow.png" },
  { name: "MLS", src: "/logos/mls.png" }
];

const TrustedByStrip = () => {
  return (
    <section className="py-12 border-t border-border bg-background">
      <div className="container mx-auto px-4 text-center">
        <motion.p
          className="text-muted-foreground text-sm uppercase tracking-wide mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Trusted by agents across the U.S.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {trustedLogos.map((logo, i) => (
            <motion.img
              key={i}
              src={logo.src}
              alt={`${logo.name} Logo`}
              className="h-8 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
              loading="lazy"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              viewport={{ once: true }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedByStrip;
