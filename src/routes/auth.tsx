import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/dashboard",
  }),
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign In — APEX Fitness" },
      {
        name: "description",
        content:
          "Sign in or create your APEX Fitness account. Members-only access to elite coaching, AI programming, and the schedule.",
      },
      { property: "og:title", content: "Sign In — APEX Fitness" },
      {
        property: "og:description",
        content: "Members-only access to APEX Fitness.",
      },
    ],
  }),
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

const signUpSchema = z.object({
  displayName: z.string().trim().min(1, "Required").max(50),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

function originSafe(): string {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // If already signed in, bounce to redirect target
  useEffect(() => {
    if (!loading && user) {
      navigate({ to: search.redirect });
    }
  }, [user, loading, navigate, search.redirect]);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { displayName: "", email: "", password: "" },
  });

  const onSignIn = async (values: SignInValues) => {
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Sign in failed", { description: error.message });
      return;
    }
    toast.success("Welcome back");
    navigate({ to: search.redirect });
  };

  const onSignUp = async (values: SignUpValues) => {
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${originSafe()}${search.redirect}`,
        data: { display_name: values.displayName },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error("Sign up failed", { description: error.message });
      return;
    }
    toast.success("Account created", {
      description: "Check your email to confirm before signing in.",
    });
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${originSafe()}${search.redirect}` },
    });
    if (error) {
      setGoogleLoading(false);
      toast.error("Google sign in failed", { description: error.message });
    }
    // On success, browser navigates away — no further state.
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left: cinematic image panel */}
        <div className="relative hidden overflow-hidden border-r border-border lg:block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, hsl(0 0% 0% / 0.85) 0%, hsl(0 72% 25% / 0.55) 60%, hsl(0 0% 0% / 0.9) 100%)",
            }}
          />
          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <Link
              to="/"
              className="font-display text-2xl font-black uppercase tracking-tight text-foreground"
            >
              APEX<span className="text-primary">.</span>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-4"
            >
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">
                Members Only
              </p>
              <h2 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight">
                Earn your <span className="text-primary">access</span>.
              </h2>
              <p className="max-w-md text-base text-foreground/70">
                Elite coaches. AI-personalized programming. The schedule that built
                champions.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right: form panel */}
        <div className="flex items-center justify-center bg-background px-6 py-32 lg:py-40">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-primary">
                The Door
              </p>
              <h1 className="font-display text-4xl font-black uppercase leading-tight tracking-tight md:text-5xl">
                Step inside.
              </h1>
              <p className="mt-3 text-sm text-foreground/60">
                Sign in to book classes, view your plan, and track progress.
              </p>
            </motion.div>

            <Tabs defaultValue="signin" className="mt-10">
              <TabsList className="grid w-full grid-cols-2 rounded-none border border-border bg-transparent p-0">
                <TabsTrigger
                  value="signin"
                  className="rounded-none text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-none text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In */}
              <TabsContent value="signin" className="mt-8">
                <Form {...signInForm}>
                  <form
                    onSubmit={signInForm.handleSubmit(onSignIn)}
                    className="space-y-5"
                  >
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-foreground/80">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              autoComplete="email"
                              placeholder="you@apex.fit"
                              className="h-11 rounded-none border-border bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-foreground/80">
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              autoComplete="current-password"
                              placeholder="••••••••"
                              className="h-11 rounded-none border-border bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        toast("Password reset coming soon", {
                          description: "Email support@apex.fit for help.",
                        })
                      }
                      className="text-xs font-medium uppercase tracking-widest text-foreground/50 transition-colors hover:text-primary"
                    >
                      Forgot password?
                    </button>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="h-12 w-full rounded-none bg-primary text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Signing In
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Sign Up */}
              <TabsContent value="signup" className="mt-8">
                <Form {...signUpForm}>
                  <form
                    onSubmit={signUpForm.handleSubmit(onSignUp)}
                    className="space-y-5"
                  >
                    <FormField
                      control={signUpForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-foreground/80">
                            Display Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="name"
                              placeholder="Alex Carter"
                              className="h-11 rounded-none border-border bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-foreground/80">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              autoComplete="email"
                              placeholder="you@apex.fit"
                              className="h-11 rounded-none border-border bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-foreground/80">
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              autoComplete="new-password"
                              placeholder="At least 8 characters"
                              className="h-11 rounded-none border-border bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="h-12 w-full rounded-none bg-primary text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Creating
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            {/* Divider + Google */}
            <div className="my-8 flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40">
                Or
              </span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onGoogle}
              disabled={googleLoading}
              className="h-12 w-full rounded-none border-border bg-transparent text-sm font-bold uppercase tracking-widest hover:bg-foreground/5"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </Button>

            <p className="mt-8 text-center text-xs text-foreground/40">
              By continuing, you agree to APEX Fitness's terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
