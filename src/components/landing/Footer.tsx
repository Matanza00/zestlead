import { Button } from "@/components/ui2/button";
import { Github, Twitter, Linkedin, Mail, Lock, CreditCard, RotateCcw } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Lead Types", href: "#lead-types" },
        { label: "How It Works", href: "#how-it-works" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About ZestLead", href: "#about" },
        { label: "Lead Tips Blog", href: "#blog" },
        { label: "Partner With Us", href: "#partner" },
        { label: "Contact Sales", href: "#contact" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "FAQs", href: "#faq" },
        { label: "Help Center", href: "#help" },
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Terms of Service", href: "#terms" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter / X" },
    { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Mail className="w-5 h-5" />, href: "#", label: "Email Us" }
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <span className="text-2xl font-bold">ZestLead</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              ZestLead helps real estate agents and brokerages close more deals with exclusive, verified leads updated daily. Affordable. Scalable. Built for success.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:text-primary"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="gradient-card rounded-xl p-6 border border-white/20 backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Real Estate Lead Tips in Your Inbox</h3>
              <p className="text-muted-foreground">
                Get actionable tips, lead strategies, and ZestLead updates every month — free for all agents.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 rounded-md border border-input bg-background text-sm"
              />
              <Button variant="hero">Subscribe</Button>
            </div>
          </div>
        </div>
       


        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ZestLead. All rights reserved.
          </p>
           <p className="text-muted-foreground text-xs text-center md:text-left flex items-center gap-2">
            <Lock className="w-3 h-3 text-primary" />
            SSL Secured •
            <CreditCard className="w-3 h-3 text-primary" />
            Stripe Verified •
            <RotateCcw className="w-3 h-3 text-primary" />
            14-Day Refund
            </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
