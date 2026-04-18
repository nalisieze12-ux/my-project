
## Apex Fitness — Premium Membership Platform

A dark, luxury fitness platform with cinematic visuals, member dashboards, class booking, and AI-ready workout plans.

### Pages & Routes
- **`/`** — Landing: cinematic hero, 6 class types grid, testimonials, pricing preview, footer
- **`/auth`** — Sign up / log in (email + password, Google OAuth)
- **`/dashboard`** — Member home: tier badge, next booked class, generate plan CTA, current plan preview
- **`/classes`** — 6 classes with trainer, schedule, intensity, Book Class action
- **`/workout-plan`** — 7-day weekly calendar of exercises (sets/reps/duration), generate new plan
- **`/pricing`** — Free Trial / Standard $49 / Premium $99 tiers
- **`/profile`** — Display name, goals, level, preferred workouts, injuries, session length, sign out

### Design System
- **Background:** `#0A0A0A` near-black, layered with `#141414` cards
- **Accent:** `#DC2626` crimson (CTAs, badges, active states)
- **Typography:** Bold serif (Playfair Display) for headlines, Inter for body
- **Imagery:** Full-bleed Unsplash fitness photography, dark gradient overlays
- **Mood:** Equinox-inspired luxury — generous whitespace, sharp edges, high contrast

### Navigation
Fixed top nav, transparent → solid `#0A0A0A` on scroll. APEX wordmark left. Public links: Classes, Pricing, Join Now (red). Auth links: Dashboard, Classes, My Plan, Profile, Sign Out. Mobile hamburger drawer.

### Backend (Lovable Cloud / Supabase)
- **Auth:** Email/password + Google OAuth (user enables provider in Supabase dashboard)
- **Tables:**
  - `profiles` — display_name, fitness_goal, fitness_level, preferred_workouts[], injuries, session_length, membership_tier
  - `bookings` — user_id, class_name, trainer, scheduled_date
  - `workout_plans` — user_id, plan_data (jsonb: 7 days of exercises), generated_at
- **RLS:** Each user reads/writes only their own rows. Public can read class catalog (hardcoded, no table needed).
- **Trigger:** Auto-create profile row on signup with default tier "Free Trial"
- **Roles:** Separate `user_roles` table + `has_role()` security definer function (for future admin features)

### Route Protection
- Public: `/`, `/auth`, `/classes` (view only), `/pricing`
- Protected (`_authenticated` layout): `/dashboard`, `/workout-plan`, `/profile`, plus booking action on `/classes`
- Unauthenticated booking attempts redirect to `/auth`

### Stubs / Future Integrations
- **AI Workout Generation:** "Generate My Workout Plan" button is wired but shows a placeholder plan; n8n webhook integration deferred
- **Stripe Subscriptions:** Pricing tier "Subscribe" buttons are visual; payment flow deferred
- **Class Schedule:** 6 classes hardcoded as constants (no admin CMS yet)
