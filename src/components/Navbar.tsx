import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const PUBLIC_LINKS = [
  { to: "/classes", label: "Classes" },
  { to: "/pricing", label: "Pricing" },
] as const;

const AUTH_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/classes", label: "Classes" },
  { to: "/workout-plan", label: "My Plan" },
  { to: "/profile", label: "Profile" },
] as const;

export function Navbar() {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = user ? AUTH_LINKS : PUBLIC_LINKS;

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-display text-2xl font-black tracking-[0.2em] text-foreground">
          APEX
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-sm uppercase tracking-widest"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              asChild
              className="rounded-none bg-primary px-6 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/auth">Join Now</Link>
            </Button>
          )}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col px-6 py-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="py-3 text-base font-medium uppercase tracking-widest text-foreground/80 hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4">
              {user ? (
                <Button onClick={handleSignOut} className="w-full rounded-none">
                  Sign Out
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link to="/auth">Join Now</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
