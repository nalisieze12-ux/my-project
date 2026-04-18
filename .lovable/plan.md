
Plan for `/pricing` page:

**Route**: `src/routes/pricing.tsx` (public)

**Layout**:
- Hero band: "MEMBERSHIP" eyebrow + "Choose your tier." headline + subhead — matches landing page typographic rhythm
- 3-column tier grid (stacks on mobile): Free Trial / Standard $49 / Premium $99 — Standard featured with crimson border + "Most Popular" badge
- Each card: tier name (Playfair, uppercase), price (large display), cadence, feature list with crimson Check icons, Subscribe CTA
- "What's included" comparison strip below — small grid showing all features × tiers with check/dash marks
- FAQ accordion (4-5 items): cancellation, freezing membership, guest passes, location access, billing
- Bottom CTA band: "Not ready? Start with a 7-day free trial." with link to /auth

**Reuse**:
- Tier data already defined inline on landing — extract to `src/lib/tiers.ts` so landing preview and `/pricing` share one source of truth
- Navbar + Footer
- Existing `Accordion` from `@/components/ui/accordion` for FAQ
- framer-motion entrance animations matching landing rhythm

**Subscribe behavior** (payment deferred):
- Buttons are visual only — `onClick` shows a sonner toast: "Subscriptions launching soon — start your free trial today." with action linking to `/auth`
- Free Trial CTA links directly to `/auth`

**Files**:
- Create `src/routes/pricing.tsx`
- Create `src/lib/tiers.ts` (shared TIERS constant with extended feature list for comparison table)
- Update `src/routes/index.tsx` to import TIERS from `src/lib/tiers.ts` instead of inline definition

**SEO**: route `head()` with unique title, description, og:title, og:description; no og:image (no hero image on this page)

**No DB/schema changes.** Stripe integration deferred per approved plan.
