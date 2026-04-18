import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon, Clock, User } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CLASSES, type FitnessClass, type ClassIntensity } from "@/lib/classes";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/classes")({
  component: ClassesPage,
  head: () => ({
    meta: [
      { title: "Classes — Apex Fitness" },
      {
        name: "description",
        content:
          "Train with elite coaches. HIIT, strength, boxing, yoga, pilates, and cardio classes built for relentless results.",
      },
    ],
  }),
});

const INTENSITY_STYLES: Record<ClassIntensity, string> = {
  Low: "bg-muted text-muted-foreground border-border",
  Moderate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  High: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Extreme: "bg-primary/20 text-primary border-primary/40",
};

const DAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function nextAvailableDate(days: string[]): Date {
  const allowed = new Set(days.map((d) => DAY_INDEX[d]));
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const candidate = new Date(d);
    candidate.setDate(d.getDate() + i);
    if (allowed.has(candidate.getDay())) return candidate;
  }
  return d;
}

function ClassesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState<FitnessClass | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const allowedDayIndexes = useMemo(
    () => (activeClass ? new Set(activeClass.days.map((d) => DAY_INDEX[d])) : null),
    [activeClass],
  );

  const handleBookClick = (cls: FitnessClass) => {
    if (!user) {
      toast.error("Sign in to book a class", {
        description: "Create a free account to reserve your spot.",
      });
      navigate({ to: "/auth", search: { redirect: "/classes" } });
      return;
    }
    setActiveClass(cls);
    setSelectedDate(nextAvailableDate(cls.days));
  };

  const handleConfirm = async () => {
    if (!user || !activeClass || !selectedDate) return;
    setSubmitting(true);

    const [hourStr, rest] = activeClass.time.split(":");
    const minuteStr = rest.slice(0, 2);
    const meridiem = rest.slice(-2).toUpperCase();
    let hour = parseInt(hourStr, 10);
    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
    const scheduled = new Date(selectedDate);
    scheduled.setHours(hour, parseInt(minuteStr, 10), 0, 0);

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      class_name: activeClass.name,
      trainer: activeClass.trainer,
      scheduled_date: scheduled.toISOString(),
    });

    setSubmitting(false);

    if (error) {
      toast.error("Booking failed", { description: error.message });
      return;
    }
    toast.success(`${activeClass.name} booked`, {
      description: `${format(scheduled, "EEE, MMM d")} · ${activeClass.time} with ${activeClass.trainer}`,
    });
    setActiveClass(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border pb-24 pt-40">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-7xl px-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-primary"
          >
            The Apex Schedule
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl"
          >
            Train with <span className="text-primary">the best</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-2xl text-lg text-foreground/70"
          >
            Six disciplines. One standard. Pick your class, lock your date, and show up
            ready to be pushed by coaches who don't accept average.
          </motion.p>
        </div>
      </section>

      {/* Classes grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CLASSES.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Card className="group h-full rounded-none border-border/60 bg-card transition-all duration-300 hover:border-primary/60 hover:shadow-[var(--shadow-crimson)]">
                <CardContent className="flex h-full flex-col gap-5 p-8">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-3xl font-bold uppercase tracking-tight">
                      {cls.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-none border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                        INTENSITY_STYLES[cls.intensity],
                      )}
                    >
                      {cls.intensity}
                    </Badge>
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-foreground/70">
                    {cls.description}
                  </p>

                  <div className="space-y-2 border-t border-border/60 pt-5 text-sm">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <User className="h-4 w-4 text-primary" />
                      <span>{cls.trainer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span>{cls.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{cls.time}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleBookClick(cls)}
                    className="mt-2 w-full rounded-none bg-primary text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                  >
                    Book Class
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Booking dialog */}
      <Dialog
        open={!!activeClass}
        onOpenChange={(open) => {
          if (!open) {
            setActiveClass(null);
            setSelectedDate(undefined);
          }
        }}
      >
        <DialogContent className="rounded-none border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl uppercase tracking-tight">
              Book {activeClass?.name}
            </DialogTitle>
            <DialogDescription className="text-foreground/70">
              {activeClass?.trainer} · {activeClass?.time} · {activeClass?.schedule}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/80">
              Select Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start rounded-none border-border bg-background text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "EEEE, MMM d, yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto rounded-none border-border bg-popover p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (date < today) return true;
                    if (allowedDayIndexes && !allowedDayIndexes.has(date.getDay()))
                      return true;
                    return false;
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Only valid class days are selectable.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setActiveClass(null)}
              className="rounded-none uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || submitting}
              className="rounded-none bg-primary uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
