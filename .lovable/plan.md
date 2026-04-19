
Plan: Send booking events to n8n webhook on class booking.

**Approach**: After successful Supabase insert in `src/routes/classes.tsx` `handleConfirm`, POST booking payload to the n8n webhook URL. Fire-and-forget (don't block UI on webhook response, log errors silently).

**Payload** (JSON):
```json
{
  "class_name": "HIIT",
  "trainer": "...",
  "scheduled_date": "2026-04-22T18:00:00.000Z",
  "scheduled_date_formatted": "Wed, Apr 22 · 6:00PM",
  "user_email": "user@example.com",
  "user_name": "Jane Doe",
  "user_id": "uuid"
}
```

**Where the data comes from**:
- `class_name`, `trainer`, `scheduled_date`: already in scope in `handleConfirm`
- `user_email`: `user.email` from `useAuth()`
- `user_name`: `user.user_metadata?.display_name` (set at signup) → fallback to `profiles.display_name` → fallback to email prefix. To keep it simple and avoid an extra round-trip, use `user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0]`.

**Implementation detail**: Webhook URL hardcoded inline (it's a public webhook URL, not a secret). Direct `fetch()` from the browser — n8n cloud webhooks accept CORS. Wrap in try/catch so a webhook failure never breaks the booking confirmation toast.

**File to change**: `src/routes/classes.tsx` only — add ~10 lines inside `handleConfirm` after the successful insert.

**No DB changes. No new dependencies. No server function needed.**
