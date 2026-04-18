
Plan for `/classes` page:

**Route**: `src/routes/classes.tsx` (public view, action gated)

**Layout**:
- Hero band: "TRAIN WITH THE BEST" + subhead, dark with crimson accent
- Grid of 6 class cards from `CLASSES` in `src/lib/classes.ts`
- Each card: class name (Playfair), trainer, schedule (days + time), intensity badge (color-coded: Low=neutral, Moderate=amber, High=orange, Extreme=crimson), description, "Book Class" button

**Booking flow**:
- Click "Book Class":
  - If `!user` → `navigate({ to: "/auth", search: { redirect: "/classes" } })` + toast "Sign in to book"
  - If logged in → open shadcn Dialog with date picker (next available date based on class.days), confirm button
  - On confirm → `supabase.from("bookings").insert({ user_id, class_name, trainer, scheduled_date })` → toast success/error
- Track per-card loading state

**Components used**: Card, Button, Badge, Dialog, Calendar (or simple date input), Navbar, Footer, sonner toast

**Auth integration**: `useAuth()` from `@/lib/auth` for `user`

**Notes**:
- No DB schema changes needed (bookings table + RLS already exist)
- `/auth` route doesn't exist yet — booking redirect will fail until it's built. I'll wire the redirect anyway; the next step (auth page) handles the destination.
- Keep page server-render safe (no `window` at module scope)
