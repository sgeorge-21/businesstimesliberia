import { Link, useLocation } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import type { ReactNode } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/business", label: "Business" },
  { to: "/economy", label: "Economy" },
  { to: "/finance", label: "Finance" },
  { to: "/stories", label: "Stories" },
  { to: "/podcast", label: "Podcast" },
  { to: "/about", label: "About" },
];

export function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav className="lbh-nav">
      <div className="nav-inner">
        <Link to="/" className="logo-block">
          <div className="logo-bar" />
          <div className="logo-text">
            <div className="small">THE LIBERIAN</div>
            <div className="big">Business Hour</div>
            <div className="sub">with James T. Worquea III</div>
          </div>
        </Link>
        <ul className="nav-links">
          {NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <li key={n.to}>
                <Link to={n.to} className={active ? "active" : ""}>
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Sheet>
          <SheetTrigger asChild>
            <button type="button" className="mobile-menu-btn" aria-label="Open menu">
              <Menu size={20} />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="mobile-nav-sheet">
            <SheetTitle className="mobile-nav-title">Pages</SheetTitle>

            <div className="mobile-nav-links">
              {NAV.map((n) => {
                const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);

                return (
                  <SheetClose asChild key={n.to}>
                    <Link to={n.to} className={active ? "active" : ""}>
                      {n.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="lbh-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="big">The Liberian Business Hour</div>
            <div className="kear">95.9FM · Monrovia, Liberia</div>
            <p>Informing Liberia's business community one story at a time. Every Saturday morning on 95.9FM.</p>
            <div className="social-row">
              <div className="social-icon">f</div>
              <div className="social-icon">𝕏</div>
              <div className="social-icon">▶</div>
            </div>
          </div>
          <div className="footer-col">
            <h5>Sections</h5>
            <Link to="/business">Business</Link>
            <Link to="/economy">Economy</Link>
            <Link to="/finance">Finance</Link>
            <Link to="/stories">Stories</Link>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <Link to="/about">About The Show</Link>
            <Link to="/podcast">Podcast Archive</Link>
            <Link to="/about">Contact Us</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 The Liberian Business Hour. All rights reserved.</span>
          <span>Built with care for Liberia 🇱🇷</span>
        </div>
      </div>
    </footer>
  );
}

export function ShowSidebar({ title = "Trending", items }: { title?: string; items: string[] }) {
  return (
    <div className="sidebar">
      <div className="sidebar-box">
        <div className="sidebar-header">About The Show</div>
        <div className="sidebar-body">
          <p>A weekly business radio program on <strong>95.9FM</strong>, hosted by James T. Worquea III.</p>
          <div className="show-detail">📅 <strong>Every Saturday</strong></div>
          <div className="show-detail">⏰ <strong>7:00 – 7:45 AM</strong></div>
          <div className="show-detail">🔁 <strong>Repeat: Sundays 5–5:45 PM</strong></div>
          <Link to="/podcast"><button className="btn-listen">Listen on 95.9FM</button></Link>
        </div>
      </div>
      <div className="sidebar-box">
        <div className="sidebar-header gold">{title}</div>
        <div className="sidebar-body" style={{ padding: 0 }}>
          <ul className="popular-list">
            {items.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) {
  return (
    <div className="lbh-app">
      <NavBar />
      {children}
      {!hideFooter && <Footer />}
    </div>
  );
}
