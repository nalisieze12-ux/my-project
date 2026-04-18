import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Calendar, Dumbbell, User as UserIcon, Flame, ArrowRight } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — APEX Fitness" },
      {
        name: "description",
        content: "Your APEX command center: upcoming sessions, plan, profile.",
      },
    ],
  }),
});

type Booking = {
  id: string;
  class_name: string;
  trainer: string;
  scheduled_date: string;
};

type Profile = {
  display_name: string | null;
  membership_tier: string;
};

function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const todayIso = new Date().toISOString();
      const [profRes, bookRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name, membership_tier")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("bookings")
          .select("id, class_name, trainer, scheduled_date")
          .eq("user_id", user.id)
          .gte("scheduled_date", todayIso)
          .order("scheduled_date", { ascending: true })
          .limit(5),
      ]);
      if (!active) return;
      setProfile(profRes.data ?? null);
      setBookings(bookRes.data ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const greetingName =
    profile?.display_name?.trim() ||
    (user?.email ? user.email.split("@")[0] : "Athlete");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">
            Welcome back
          </p>
          <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            {greetingName}.
          </h1>
          <p className="mt-4 max-w-xl text-base text-foreground/60">
            {profile?.membership_tier
              ? `${profile.membership_tier} membership`
              : "Apex member"}
            . Here's what's on the floor.
          </p>
        </motion.div>

        {/* Quick links */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <QuickLink
            to="/classes"
            icon={<Calendar className="h-5 w-5" />}
            label="Book a Class"
            sub="Browse the schedule"
          />
          <QuickLink
            to="/workout-plan"
            icon={<Dumbbell className="h-5 w-5" />}
            label="My Workout Plan"
            sub="AI-personalized programming"
          />
          <QuickLink
            to="/profile"
            icon={<UserIcon className="h-5 w-5" />}
            label="Profile & Goals"
            sub="Update your training profile"
          />
        </div>

        {/* Upcoming bookings */}
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">
                Schedule
              </p>
              <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight">
                Upcoming Sessions
              </h2>
            </div>
            <Button
              asChild
              variant="ghost"
              className="text-xs font-bold uppercase tracking-widest text-foreground/60"
            >
              <Link to="/classes">
                Book more <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : bookings.length === 0 ? (
            <Card className="rounded-none border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <Flame className="h-10 w-10 text-primary/60" />
                <p className="text-foreground/60">
                  No upcoming sessions. The floor is waiting.
                </p>
                <Button
                  asChild
                  className="rounded-none bg-primary text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                >
                  <Link to="/classes">Browse Classes</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {bookings.map((b) => {
                const date = parseISO(b.scheduled_date);
                return (
                  <li
                    key={b.id}
                    className="flex items-center justify-between border border-border bg-card px-6 py-5"
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex h-14 w-14 flex-col items-center justify-center border border-primary/40 bg-primary/10">
                        <span className="font-display text-xl font-black leading-none text-primary">
                          {format(date, "d")}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                          {format(date, "MMM")}
                        </span>
                      </div>
                      <div>
                        <p className="font-display text-lg font-bold uppercase tracking-tight">
                          {b.class_name}
                        </p>
                        <p className="text-xs uppercase tracking-widest text-foreground/50">
                          {b.trainer} • {format(date, "EEE 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function QuickLink({
  to,
  icon,
  label,
  sub,
}: {
  to: "/classes" | "/workout-plan" | "/profile";
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <Link
      to={to}
      className="group block border border-border bg-card p-6 transition-colors hover:border-primary/60 hover:bg-card/80"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center bg-primary/15 text-primary">
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      <p className="mt-6 font-display text-xl font-black uppercase tracking-tight">
        {label}
      </p>
      <p className="mt-1 text-xs uppercase tracking-widest text-foreground/50">{sub}</p>
    </Link>
  );
}
