import { motion ,easeOut , Variants} from "framer-motion";

const testimonials = [
  {
    name: "Jessica Lee",
    location: "San Diego, CA",
    quote:
      "ZestLead has completely changed how I find clients. I closed 3 deals in my first month using their exclusive leads.",
    avatar: "https://ui-avatars.com/api/?name=Jessica+Lee&background=285B19&color=fff"
  },
  {
    name: "Malik Thompson",
    location: "Atlanta, GA",
    quote:
      "I’ve used Zillow and others before, but ZestLead’s filters, real-time delivery, and refund policy make it unbeatable for serious agents.",
    avatar: "https://ui-avatars.com/api/?name=Malik+Thompson&background=285B19&color=fff"
  },
  {
    name: "Ava Patel",
    location: "Austin, TX",
    quote:
      "As a solo agent, I needed something affordable and reliable. ZestLead delivers real, verified leads—and support that cares.",
    avatar: "https://ui-avatars.com/api/?name=Ava+Patel&background=285B19&color=fff"
  }
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: easeOut // ✅ use easing function
    }
  })
};

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          What Agents Are Saying
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white border border-border p-6 rounded-xl shadow-sm flex flex-col items-center text-center cursor-pointer"
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <img
                src={t.avatar}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover mb-4"
              />
              <p className="text-sm text-muted-foreground mb-4">"{t.quote}"</p>
              <div className="text-sm font-semibold text-primary">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.location}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
