import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile — APEX Fitness" },
      {
        name: "description",
        content: "Update your training profile, goals, and preferences.",
      },
    ],
  }),
});

const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced", "Elite"];
const FITNESS_GOALS = [
  "Build muscle",
  "Lose fat",
  "Improve endurance",
  "Mobility & recovery",
  "Sport-specific performance",
];
const WORKOUT_OPTIONS = [
  "HIIT",
  "Strength Training",
  "Boxing",
  "Yoga",
  "Pilates",
  "Cardio",
];

type ProfileForm = {
  display_name: string;
  fitness_goal: string;
  fitness_level: string;
  session_length: number;
  injuries: string;
  preferred_workouts: string[];
};

const EMPTY: ProfileForm = {
  display_name: "",
  fitness_goal: "",
  fitness_level: "",
  session_length: 45,
  injuries: "",
  preferred_workouts: [],
};

function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select(
          "display_name, fitness_goal, fitness_level, session_length, injuries, preferred_workouts",
        )
        .eq("user_id", user.id)
        .maybeSingle();
      if (!active) return;
      if (data) {
        setForm({
          display_name: data.display_name ?? "",
          fitness_goal: data.fitness_goal ?? "",
          fitness_level: data.fitness_level ?? "",
          session_length: data.session_length ?? 45,
          injuries: data.injuries ?? "",
          preferred_workouts: data.preferred_workouts ?? [],
        });
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const toggleWorkout = (w: string) => {
    setForm((f) => ({
      ...f,
      preferred_workouts: f.preferred_workouts.includes(w)
        ? f.preferred_workouts.filter((x) => x !== w)
        : [...f.preferred_workouts, w],
    }));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        display_name: form.display_name.trim() || null,
        fitness_goal: form.fitness_goal || null,
        fitness_level: form.fitness_level || null,
        session_length: form.session_length,
        injuries: form.injuries.trim() || null,
        preferred_workouts: form.preferred_workouts,
      },
      { onConflict: "user_id" },
    );
    setSaving(false);
    if (error) {
      toast.error("Couldn't save", { description: error.message });
      return;
    }
    toast.success("Profile updated");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">
            Your Profile
          </p>
          <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            Train smarter.
          </h1>
          <p className="mt-4 max-w-xl text-base text-foreground/60">
            Tell us how you train. We'll personalize the plan.
          </p>
        </motion.div>

        {loading ? (
          <div className="mt-12 space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <form onSubmit={onSave} className="mt-12 space-y-8">
            <Field label="Display Name">
              <Input
                value={form.display_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, display_name: e.target.value }))
                }
                placeholder="Alex Carter"
                maxLength={50}
                className="h-11 rounded-none border-border bg-background"
              />
            </Field>

            <Field label="Email">
              <Input
                value={user?.email ?? ""}
                disabled
                className="h-11 rounded-none border-border bg-background/50"
              />
            </Field>

            <div className="grid gap-8 md:grid-cols-2">
              <Field label="Fitness Level">
                <Select
                  value={form.fitness_level}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, fitness_level: v }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-none border-border bg-background">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {FITNESS_LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Primary Goal">
                <Select
                  value={form.fitness_goal}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, fitness_goal: v }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-none border-border bg-background">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {FITNESS_GOALS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label={`Session Length — ${form.session_length} min`}>
              <input
                type="range"
                min={15}
                max={120}
                step={15}
                value={form.session_length}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    session_length: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full accent-primary"
              />
            </Field>

            <Field label="Preferred Workouts">
              <div className="flex flex-wrap gap-2">
                {WORKOUT_OPTIONS.map((w) => {
                  const active = form.preferred_workouts.includes(w);
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => toggleWorkout(w)}
                      className={`border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-transparent text-foreground/70 hover:border-primary/60 hover:text-foreground"
                      }`}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Injuries or Limitations">
              <Textarea
                value={form.injuries}
                onChange={(e) =>
                  setForm((f) => ({ ...f, injuries: e.target.value }))
                }
                placeholder="E.g. lower back, left knee — anything we should program around."
                rows={4}
                maxLength={500}
                className="rounded-none border-border bg-background"
              />
            </Field>

            <Button
              type="submit"
              disabled={saving}
              className="h-12 w-full rounded-none bg-primary text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-bold uppercase tracking-widest text-foreground/80">
        {label}
      </Label>
      {children}
    </div>
  );
}
