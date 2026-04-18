import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Flame,
  Leaf,
  Activity,
  Hand,
  Dumbbell,
  Heart,
  ArrowRight,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "APEX Fitness — Elevate Your Body. Transform Your Life." },
      {
        name: "description",
        content:
          "A premium members-only fitness collective. Cinematic training, world-class coaches, AI-personalized programming.",
      },
      { property: "og:title", content: "APEX Fitness" },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80",
      },
    ],
  }),
});

const CLASS_TYPES = [
  { name: "HIIT", icon: Flame, desc: "Explosive intervals to torch fat and forge mental grit." },
  { name: "Yoga", icon: Leaf, desc: "Restore the body, settle the mind through deep flow." },
  { name: "Pilates", icon: Activity, desc: "Precision movement for a stronger core and longer lines." },
  { name: "Boxing", icon: Hand, desc: "Pad work, footwork, and fight conditioning." },
  { name: "Strength Training", icon: Dumbbell, desc: "Heavy compound lifts. No shortcuts. Pure power." },
  { name: "Cardio", icon: Heart, desc: "Endurance training that turns minutes into miles." },
];

const TESTIMONIALS = [
  {
    quote:
      "Apex didn't just change my body. It changed how I move through the world. The trainers see things in you that you don't see yourself.",
    name: "Elena Vasquez",
    role: "Member · 3 years",
  },
  {
    quote:
      "I've trained at clubs across three continents. Nothing comes close to the standard at Apex. It's a temple, not a gym.",
    name: "Marcus Chen",
    role: "Member · 5 years",
  },
  {
    quote:
      "The AI workout plans are uncanny. They adapt every week. I've added 80 pounds to my deadlift in six months.",
    name: "James Okafor",
    role: "Member · 1 year",
  },
];

const TIERS = [
  {
    name: "Free Trial",
    price: "$0",
    cadence: "7 days",
    features: ["Access to 2 classes / week", "Community access", "Locker amenities"],
    cta: "Start Trial",
  },
  {
    name: "Standard",
    price: "$49",
    cadence: "per month",
    features: ["Unlimited classes", "Workout tracking", "All locations"],
    cta: "Subscribe",
    featured: true,
  },
  {
    name: "Premium",
    price: "$99",
    cadence: "per month",
    features: ["Everything in Standard", "Personal training", "AI workout plans", "Spa access"],
    cta: "Go Premium",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=2000&q=85')",
          }}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-background/30" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Members-only collective
            </div>
            <h1 className="font-display text-5xl font-black leading-[1.05] text-foreground sm:text-7xl md:text-[5.5rem]">
              ELEVATE YOUR BODY.
              <br />
              <span className="text-primary">TRANSFORM</span> YOUR LIFE.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-foreground/80">
              Train under world-class coaches in cinematic spaces designed for those
              who refuse the ordinary.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-none bg-primary px-10 py-7 text-base font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                style={{ boxShadow: "var(--shadow-crimson)" }}
              >
                <Link to="/auth">Join Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-none border-foreground/30 bg-transparent px-10 py-7 text-base font-bold uppercase tracking-widest text-foreground hover:bg-foreground/10"
              >
                <Link to="/classes">Explore Classes</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CLASSES GRID */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-2xl">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Six disciplines
            </div>
            <h2 className="font-display text-4xl font-bold text-foreground md:text-6xl">
              Train with intention.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {CLASS_TYPES.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden bg-card p-10 transition-colors hover:bg-secondary"
              >
                <c.icon className="h-10 w-10 text-primary transition-transform duration-500 group-hover:scale-110" />
                <h3 className="mt-6 font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                  {c.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.desc}
                </p>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-border bg-card/50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-2xl">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Voices
            </div>
            <h2 className="font-display text-4xl font-bold text-foreground md:text-6xl">
              From our members.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-border bg-card p-10"
              >
                <div className="font-display text-5xl text-primary">"</div>
                <p className="mt-2 text-base leading-relaxed text-foreground/90">
                  {t.quote}
                </p>
                <div className="mt-8 border-t border-border pt-6">
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Membership
              </div>
              <h2 className="font-display text-4xl font-bold text-foreground md:text-6xl">
                Choose your tier.
              </h2>
            </div>
            <Link
              to="/pricing"
              className="text-sm font-semibold uppercase tracking-widest text-primary hover:underline"
            >
              Compare all plans →
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col border p-10 ${
                  tier.featured
                    ? "border-primary bg-card"
                    : "border-border bg-card/50"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-10 bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                  {tier.name}
                </h3>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-black text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/{tier.cadence}</span>
                </div>
                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`mt-8 rounded-none ${
                    tier.featured
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                  }`}
                >
                  <Link to="/pricing">{tier.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
