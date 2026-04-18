
Plan for `/auth` page:

**Route**: `src/routes/auth.tsx` (public)

**Layout**:
- Split-screen: left = full-bleed Unsplash fitness image with crimson tint overlay + APEX brand mark + tagline; right = dark form panel (stacks on mobile, image becomes top band)
- Right panel: shadcn `Tabs` for "Sign In" / "Sign Up", each with email + password inputs, primary submit button, divider, "Continue with Google" outline button
- Forgot password link under Sign In form (defer actual reset page — show toast "Coming soon" for now to keep scope tight, OR include — see question)

**Validation** (zod):
- email: `.trim().email().max(255)`
- password: `.min(8).max(72)` (bcrypt limit)
- displayName (signup only): `.trim().min(1).max(50)`
- Inline error messages under inputs via react-hook-form + zodResolver

**Auth flows**:
- Sign up → `supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/dashboard", data: { display_name } } })` — `handle_new_user` trigger creates profile + member role automatically
- Sign in → `supabase.auth.signInWithPassword({ email, password })`
- Google → `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + redirectParam } })`
- All `window.*` access guarded with `typeof window !== "undefined"` (SSR safety)

**Redirect-back**:
- `validateSearch`: `{ redirect: string = "/dashboard" }`
- On successful sign in/up → `navigate({ to: search.redirect })`
- `beforeLoad`: if already authenticated, redirect to `search.redirect` — but auth state lives in client `AuthProvider` (not router context). Workaround: check `supabase.auth.getSession()` inside component on mount and redirect; OR keep simple and only redirect after successful action. Going with the simpler approach to avoid restructuring router context.
- Update `/classes` booking redirect to pass `redirect: "/classes"` search param (already wired per prior step — verify)

**Toast feedback**: sonner for success ("Welcome back" / "Check your email to confirm") and errors (Supabase error messages)

**SEO**: route `head()` with title "Sign In — APEX Fitness", description, og tags

**Files**:
- Create `src/routes/auth.tsx`
- No DB changes (trigger + tables already in place)
- No new dependencies (zod, react-hook-form, @hookform/resolvers already present via shadcn form)

**Notes for user**:
- Email confirmation is ON by default in Supabase — new signups will need to confirm email before sign in works. Mention this in the success toast. User can disable in Supabase dashboard for faster testing.
- Google OAuth requires configuring the Google provider in Supabase dashboard (Auth → Providers → Google) with client ID/secret. Until configured, the Google button will error. I'll wire the button correctly; user enables the provider separately.
