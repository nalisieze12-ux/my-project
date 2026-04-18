export type Tier = {
  name: string;
  price: string;
  cadence: string;
  features: string[];
  cta: string;
  featured?: boolean;
  blurb: string;
};

export const TIERS: Tier[] = [
  {
    name: "Free Trial",
    price: "$0",
    cadence: "7 days",
    blurb: "Sample the collective. No commitment.",
    features: ["Access to 2 classes / week", "Community access", "Locker amenities"],
    cta: "Start Trial",
  },
  {
    name: "Standard",
    price: "$49",
    cadence: "per month",
    blurb: "Unlimited training across every discipline.",
    features: ["Unlimited classes", "Workout tracking", "All locations"],
    cta: "Subscribe",
    featured: true,
  },
  {
    name: "Premium",
    price: "$99",
    cadence: "per month",
    blurb: "The full Apex experience. AI-personalized.",
    features: [
      "Everything in Standard",
      "Personal training",
      "AI workout plans",
      "Spa access",
    ],
    cta: "Go Premium",
  },
];

// Full feature matrix for comparison strip
export const COMPARISON_FEATURES: { label: string; tiers: [boolean, boolean, boolean] }[] = [
  { label: "Group classes", tiers: [true, true, true] },
  { label: "Locker & shower amenities", tiers: [true, true, true] },
  { label: "Community events", tiers: [true, true, true] },
  { label: "Unlimited class bookings", tiers: [false, true, true] },
  { label: "Workout tracking & analytics", tiers: [false, true, true] },
  { label: "Access to all locations", tiers: [false, true, true] },
  { label: "1-on-1 personal training", tiers: [false, false, true] },
  { label: "AI-personalized programming", tiers: [false, false, true] },
  { label: "Recovery spa & sauna", tiers: [false, false, true] },
  { label: "Priority class booking", tiers: [false, false, true] },
];

export const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Memberships are month-to-month with no long-term contracts. Cancel from your dashboard at any time — your access remains active until the end of the current billing cycle.",
  },
  {
    q: "Can I freeze my membership?",
    a: "Standard and Premium members can freeze their membership for up to 90 days per year at no charge. Useful for travel, injury recovery, or simply taking a breath.",
  },
  {
    q: "Do guests get access?",
    a: "Premium members receive 4 guest passes per month. Standard members can purchase day passes for guests at $25 each.",
  },
  {
    q: "Which locations are included?",
    a: "Standard and Premium memberships include unlimited access to every Apex location worldwide. Free Trial members can train at the location of sign-up only.",
  },
  {
    q: "How does billing work?",
    a: "Memberships renew monthly on the date you joined. We accept all major cards. Receipts are emailed automatically and available in your dashboard.",
  },
];
