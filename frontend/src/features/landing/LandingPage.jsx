import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  CalendarCheck,
  Ticket,
  Briefcase,
  Bell,
  ShieldCheck,
} from "lucide-react";
import Button from "../../components/common/Button.jsx";
import { Card } from "../../components/common/Card.jsx";

const featureList = [
  { icon: CalendarCheck, title: "Attendance", body: "QR self check-in and subject-wise history, no more paper registers." },
  { icon: Ticket, title: "Events", body: "Create, register and check in attendees with a scannable pass." },
  { icon: Briefcase, title: "Placements", body: "Post openings, track applications, and shortlist without spreadsheets." },
  { icon: Bell, title: "Notices", body: "Announcements reach exactly the department and role they're meant for." },
];

const statList = [
  { value: "12k+", label: "Students onboarded" },
  { value: "480+", label: "Faculty using it weekly" },
  { value: "97%", label: "Attendance marked on time" },
  { value: "4 roles", label: "Student, faculty, coordinator, admin" },
];

const faqList = [
  { q: "Can faculty and students share one login system?", a: "Yes — one account, role-based access. What you see depends on your role, not a separate portal." },
  { q: "Does it work on a phone?", a: "The whole platform is responsive, and QR attendance is built for scanning on mobile." },
  { q: "Is data separated by department?", a: "Notices, courses and reports are scoped so a department only sees what's relevant to it." },
];

export default function LandingPage() {
  return (
    <div className="bg-canvas text-ink dark:bg-ink dark:text-canvas">
      {/* top navigation */}
      <header className="flex items-center justify-between px-6 py-5 lg:px-16">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <GraduationCap size={18} />
          </span>
          <span className="font-display text-lg font-semibold">CampusConnect</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#features">Features</a>
          <a href="#stats">Statistics</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium">
            Log in
          </Link>
          <Link to="/signup">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      {/* hero section */}
      <section className="grid grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-16 lg:py-24">
        <div>
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-white/10 dark:text-brand-300">
            EdTech · SaaS · Productivity
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight lg:text-5xl">
            Every campus workflow, out of the WhatsApp groups and into one place.
          </h1>
          <p className="mt-5 max-w-lg text-muted">
            Attendance, assignments, events, placements and clubs — one
            platform for students, faculty, coordinators and admins, with
            role-based dashboards for each.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/signup">
              <Button>Create your account</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">I already have one</Button>
            </Link>
          </div>
        </div>
        <Card className="p-8">
          <p className="text-sm text-muted">Today at a glance</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="font-display text-3xl font-semibold">96%</p>
              <p className="text-xs text-muted">Attendance marked</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold">18</p>
              <p className="text-xs text-muted">Assignments due this week</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold">5</p>
              <p className="text-xs text-muted">Events open for registration</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold">3</p>
              <p className="text-xs text-muted">New placement drives</p>
            </div>
          </div>
        </Card>
      </section>

      {/* feature grid */}
      <section id="features" className="px-6 py-16 lg:px-16">
        <h2 className="font-display text-2xl font-semibold">Built around what a campus actually does</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureList.map((feature) => (
            <Card key={feature.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-white/5 dark:text-brand-300">
                <feature.icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-lg font-medium">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted">{feature.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* statistics */}
      <section id="stats" className="bg-brand-700 px-6 py-16 text-white lg:px-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {statList.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-brand-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* testimonial */}
      <section className="px-6 py-16 lg:px-16">
        <Card className="mx-auto max-w-2xl text-center">
          <ShieldCheck className="mx-auto text-brand-600" size={22} />
          <p className="mt-4 font-display text-xl leading-relaxed">
            "We replaced four different tools and a dozen WhatsApp groups
            with one dashboard our faculty actually opens every morning."
          </p>
          <p className="mt-3 text-sm text-muted">Dean of Student Affairs</p>
        </Card>
      </section>

      {/* faq */}
      <section id="faq" className="px-6 py-16 lg:px-16">
        <h2 className="font-display text-2xl font-semibold">Frequently asked</h2>
        <div className="mt-8 flex flex-col gap-4">
          {faqList.map((item) => (
            <Card key={item.q}>
              <p className="font-medium">{item.q}</p>
              <p className="mt-1 text-sm text-muted">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-border px-6 py-10 text-sm text-muted lg:px-16 dark:border-white/10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span>© {new Date().getFullYear()} CampusConnect</span>
          <div className="flex gap-6">
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
            <Link to="/login">Log in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
