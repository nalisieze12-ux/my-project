import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Loader2, Sparkles, RefreshCw, Dumbbell } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/workout-plan")({
  component: WorkoutPlanPage,
  head: () => ({
    meta: [
      { title: "Workout Plan — APEX Fitness" },
      {
        name: "description",
        content: "Your AI-personalized weekly training plan.",
      },
    ],
  }),
});

type Exercise = { name: string; sets: number; reps: string };
type DaySession = {
  day: string;
  focus: string;
  duration: number;
  intensity: string;
  exercises: Exercise[];
};
type Plan = {
  summary: string;
  goal: string;
  level: string;
  sessions_per_week: number;
  days: DaySession[];
};

type StoredPlan = {
  id: string;
  generated_at: string;
  plan_data: Plan;
};

type ProfileLite = {
  display_name: string | null;
  fitness_goal: string | null;
  fitness_level: string | null;
  session_length: number | null;
  preferred_workouts: string[] | null;
  injuries: string | null;
};

function buildPlan(profile: ProfileLite | null): Plan {
  const goal = profile?.fitness_goal || "Build muscle";
  const level = profile?.fitness_level || "Intermediate";
  const duration = profile?.session_length ?? 45;
  const prefs =
    profile?.preferred_workouts && profile.preferred_workouts.length > 0
      ? profile.preferred_workouts
      : ["Strength Training", "HIIT", "Cardio"];

  const repScheme =
    goal === "Build muscle"
      ? "8-12"
      : goal === "Lose fat"
        ? "12-15"
        : goal === "Improve endurance"
          ? "15-20"
          : "10-12";

  const intensity =
    level === "Elite" ? "High" : level === "Advanced" ? "High" : level === "Beginner" ? "Low" : "Moderate";

  const libraries: Record<string, Exercise[]> = {
    "Strength Training": [
      { name: "Back Squat", sets: 4, reps: repScheme },
      { name: "Bench Press", sets: 4, reps: repScheme },
      { name: "Deadlift", sets: 3, reps: repScheme },
      { name: "Pull-Ups", sets: 3, reps: repScheme },
    ],
    HIIT: [
      { name: "Sprint Intervals", sets: 8, reps: "30s on / 30s off" },
      { name: "Burpees", sets: 4, reps: "20" },
      { name: "Kettlebell Swings", sets: 4, reps: "20" },
    ],
    Boxing: [
      { name: "Heavy Bag Rounds", sets: 6, reps: "3 min" },
      { name: "Footwork Drills", sets: 4, reps: "2 min" },
      { name: "Pad Combos", sets: 5, reps: "3 min" },
    ],
    Yoga: [
      { name: "Sun Salutation A", sets: 3, reps: "5 cycles" },
      { name: "Warrior Flow", sets: 2, reps: "8 min" },
      { name: "Hip Openers", sets: 3, reps: "5 min" },
    ],
    Pilates: [
      { name: "The Hundred", sets: 1, reps: "100" },
      { name: "Roll-Ups", sets: 3, reps: "10" },
      { name: "Single-Leg Stretch", sets: 3, reps: "20" },
    ],
    Cardio: [
      { name: "Steady-State Run", sets: 1, reps: "30 min" },
      { name: "Row Intervals", sets: 5, reps: "500m" },
    ],
  };

  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days: DaySession[] = week.map((d, i) => {
    const focus = prefs[i % prefs.length];
    return {
      day: d,
      focus,
      duration,
      intensity,
      exercises: libraries[focus] ?? libraries["Strength Training"],
    };
  });

  return {
    summary: `${level} ${goal.toLowerCase()} program — ${duration}-min sessions, 6 days/week. ${
      profile?.injuries
        ? `Programmed around: ${profile.injuries}.`
        : "Built around your preferred disciplines."
    }`,
    goal,
    level,
    sessions_per_week: 6,
    days,
  };
}

function WorkoutPlanPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<StoredPlan | null>(null);
  const [profile, setProfile] = useState<ProfileLite | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const [planRes, profRes] = await Promise.all([
        supabase
          .from("workout_plans")
          .select("id, generated_at, plan_data")
          .eq("user_id", user.id)
          .order("generated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select(
            "display_name, fitness_goal, fitness_level, session_length, preferred_workouts, injuries",
          )
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);
      if (!active) return;
      setProfile(profRes.data ?? null);
      if (planRes.data) {
        setPlan({
          id: planRes.data.id,
          generated_at: planRes.data.generated_at,
          plan_data: planRes.data.plan_data as unknown as Plan,
        });
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const onGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    const newPlan = buildPlan(profile);
    const { data, error } = await supabase
      .from("workout_plans")
      .insert([
        {
          user_id: user.id,
          plan_data: newPlan as unknown as Plan as never,
        },
      ])
      .select("id, generated_at, plan_data")
      .single();
    setGenerating(false);
    if (error || !data) {
      toast.error("Couldn't generate plan", { description: error?.message });
      return;
    }
    setPlan({
      id: data.id,
      generated_at: data.generated_at,
      plan_data: data.plan_data as unknown as Plan,
    });
    toast.success("Plan generated");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">
            Your Programming
          </p>
          <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            The Plan.
          </h1>
          {plan && (
            <p className="mt-4 max-w-2xl text-base text-foreground/60">
              {plan.plan_data.summary}
            </p>
          )}
        </motion.div>

        {loading ? (
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
        ) : !plan ? (
          <div className="mt-16 border border-border bg-card p-12 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-6 font-display text-3xl font-black uppercase tracking-tight">
              No plan yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-foreground/60">
              {profile?.fitness_goal
                ? "Generate your personalized weekly program — built from your profile."
                : "Set your goals on the profile page first, then generate a plan tailored to you."}
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              {!profile?.fitness_goal && (
                <Button
                  asChild
                  variant="outline"
                  className="rounded-none border-border text-xs font-bold uppercase tracking-widest"
                >
                  <Link to="/profile">Set Goals</Link>
                </Button>
              )}
              <Button
                onClick={onGenerate}
                disabled={generating}
                className="rounded-none bg-primary text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
              <div className="flex flex-wrap gap-6 text-xs uppercase tracking-widest text-foreground/60">
                <span>
                  Goal: <span className="text-foreground">{plan.plan_data.goal}</span>
                </span>
                <span>
                  Level: <span className="text-foreground">{plan.plan_data.level}</span>
                </span>
                <span>
                  Generated:{" "}
                  <span className="text-foreground">
                    {format(parseISO(plan.generated_at), "MMM d, yyyy")}
                  </span>
                </span>
              </div>
              <Button
                onClick={onGenerate}
                disabled={generating}
                variant="outline"
                className="rounded-none border-border text-xs font-bold uppercase tracking-widest"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Regenerating
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" /> Regenerate
                  </>
                )}
              </Button>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {plan.plan_data.days.map((d) => (
                <article
                  key={d.day}
                  className="border border-border bg-card p-6 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-black uppercase tracking-tight text-primary">
                      {d.day}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                      {d.duration} min • {d.intensity}
                    </span>
                  </div>
                  <h3 className="mt-4 flex items-center gap-2 font-display text-lg font-bold uppercase tracking-tight">
                    <Dumbbell className="h-4 w-4 text-primary" />
                    {d.focus}
                  </h3>
                  <ul className="mt-5 space-y-3 border-t border-border pt-5">
                    {d.exercises.map((ex) => (
                      <li
                        key={ex.name}
                        className="flex items-baseline justify-between gap-3 text-sm"
                      >
                        <span className="text-foreground/90">{ex.name}</span>
                        <span className="shrink-0 text-xs uppercase tracking-widest text-foreground/50">
                          {ex.sets} × {ex.reps}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
