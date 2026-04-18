import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl font-black tracking-[0.2em]">APEX</div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            A members-only fitness collective for those who refuse the ordinary.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Explore
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/classes" className="hover:text-primary">Classes</Link></li>
              <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link to="/auth" className="hover:text-primary">Join</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Company
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="hover:text-primary" href="#">About</a></li>
              <li><a className="hover:text-primary" href="#">Careers</a></li>
              <li><a className="hover:text-primary" href="#">Press</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <div className="flex gap-4">
            <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" aria-label="YouTube" className="text-muted-foreground hover:text-primary">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Apex Fitness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
