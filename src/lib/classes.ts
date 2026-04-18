// Hardcoded class catalog for Apex Fitness
export type ClassIntensity = "Low" | "Moderate" | "High" | "Extreme";

export type FitnessClass = {
  id: string;
  name: string;
  trainer: string;
  schedule: string;
  days: string[];
  time: string;
  intensity: ClassIntensity;
  description: string;
};

export const CLASSES: FitnessClass[] = [
  {
    id: "hiit",
    name: "HIIT",
    trainer: "Coach Marcus",
    schedule: "Mon / Wed / Fri",
    days: ["Mon", "Wed", "Fri"],
    time: "6:00 AM",
    intensity: "Extreme",
    description: "Explosive intervals built to torch fat and forge mental grit.",
  },
  {
    id: "yoga",
    name: "Yoga",
    trainer: "Coach Amara",
    schedule: "Tue / Thu",
    days: ["Tue", "Thu"],
    time: "7:00 AM",
    intensity: "Low",
    description: "Slow flow, deep stretch. Restore the body, settle the mind.",
  },
  {
    id: "pilates",
    name: "Pilates",
    trainer: "Coach Sofia",
    schedule: "Mon / Wed",
    days: ["Mon", "Wed"],
    time: "5:00 PM",
    intensity: "Moderate",
    description: "Precision movement for a stronger core and longer lines.",
  },
  {
    id: "boxing",
    name: "Boxing",
    trainer: "Coach James",
    schedule: "Tue / Thu",
    days: ["Tue", "Thu"],
    time: "6:00 PM",
    intensity: "High",
    description: "Pad work, footwork, and fight conditioning. Built like an athlete.",
  },
  {
    id: "strength",
    name: "Strength Training",
    trainer: "Coach David",
    schedule: "Mon / Wed / Fri",
    days: ["Mon", "Wed", "Fri"],
    time: "7:00 AM",
    intensity: "High",
    description: "Heavy compound lifts. Build muscle. Add weight. No shortcuts.",
  },
  {
    id: "cardio",
    name: "Cardio",
    trainer: "Coach Nina",
    schedule: "Sat",
    days: ["Sat"],
    time: "8:00 AM",
    intensity: "Moderate",
    description: "Endurance training that turns minutes into miles.",
  },
];
