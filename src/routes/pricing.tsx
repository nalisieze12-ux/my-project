import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Minus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TIERS, COMPARISON_FEATURES, FAQS } from "@/lib/tiers";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Membership — APEX Fitness" },
      {
        name: "description",
        content:
          "Three tiers built around how you train. Free 7-day trial, Standard $49/mo, Premium $99/mo with personal training and AI-personalized programming.",
      },
      { property: "og:title", content: "APEX Membership — Choose your tier." },
      {
        property: "og:description",
        content:
          "Free trial, Standard, and Premium memberships. Unlimited classes, AI programming, personal training. Cancel anytime.",
      },
    ],
  }),
});

function handleSubscribe(tierName: string) {
  toast.info("Subscriptions launching soon", {
    description: `Your ${tierName} tier will be available shortly. Start with a free trial today.`,
    action: {
      label: "Start Trial",
      onClick: () => {
        window.location.href = "/auth";
      },
    },
  });
}

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border pt-32 pb-20 md:pt-40 md:pb-28">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--primary) 0, transparent 50%), radial-gradient(circle at 80% 80%, var(--primary) 0, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Membership
            </div>
            <h1 className="font-display text-5xl font-black leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
              Choose your <span className="text-primary">tier.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Three ways to train under world-class coaches. No contracts. Cancel anytime.
              Built for those who refuse to plateau.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TIER GRID */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col border p-10 ${
                  tier.featured
                    ? "border-primary bg-card md:-translate-y-4"
                    : "border-border bg-card/50"
                }`}
                style={tier.featured ? { boxShadow: "var(--shadow-crimson)" } : undefined}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-10 bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{tier.blurb}</p>
                <div className="mt-8 flex items-baseline gap-2">
                  <span className="font-display text-6xl font-black text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/{tier.cadence}</span>
                </div>
                <ul className="mt-10 flex-1 space-y-4">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-foreground/80"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.name === "Free Trial" ? (
                  <Button
                    asChild
                    className="mt-10 rounded-none bg-foreground/10 py-6 text-sm font-bold uppercase tracking-widest text-foreground hover:bg-foreground/20"
                  >
                    <Link to="/auth">
                      {tier.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubscribe(tier.name)}
                    className={`mt-10 rounded-none py-6 text-sm font-bold uppercase tracking-widest ${
                      tier.featured
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                    }`}
                  >
                    {tier.cta}
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="border-y border-border bg-card/50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-2xl">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              What's included
            </div>
            <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
              Compare every detail.
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-5 pr-6 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Feature
                  </th>
                  {TIERS.map((t) => (
                    <th
                      key={t.name}
                      className={`px-4 py-5 text-center font-display text-sm font-bold uppercase tracking-wide ${
                        t.featured ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                  >
                    <td className="py-4 pr-6 text-sm text-foreground/90">{row.label}</td>
                    {row.tiers.map((included, idx) => (
                      <td key={idx} className="px-4 py-4 text-center">
                        {included ? (
                          <Check className="mx-auto h-5 w-5 text-primary" />
                        ) : (
                          <Minus className="mx-auto h-5 w-5 text-muted-foreground/40" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 max-w-2xl">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Questions
            </div>
            <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
              Before you commit.
            </h2>
          </div>
          <Accordion type="single" collapsible className="border-t border-border">
            {FAQS.map((item) => (
              <AccordionItem
                key={item.q}
                value={item.q}
                className="border-b border-border"
              >
                <AccordionTrigger className="py-6 text-left font-display text-lg font-semibold text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center md:py-20">
          <div className="max-w-xl">
            <h3 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Not ready? Start with a <span className="text-primary">7-day free trial.</span>
            </h3>
            <p className="mt-3 text-muted-foreground">
              Step inside the collective. No card required.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-none bg-primary px-10 py-7 text-base font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            style={{ boxShadow: "var(--shadow-crimson)" }}
          >
            <Link to="/auth">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
