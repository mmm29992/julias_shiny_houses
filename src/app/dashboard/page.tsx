"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "../components/i18n/LangProvider";
import {
  Users,
  CalendarDays,
  FileText,
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------
// Types
// ---------------------------------------------

type Lead = {
  id: string;
  name: string;
  service: "Deep Clean" | "Standard" | "Move-In/Out" | "Office";
  createdAt: string; // ISO
  status: "New" | "Contacted" | "Scheduled" | "Closed";
  phone?: string;
  notes?: string;
};

type Task = {
  id: string;
  title: string;
  done: boolean;
  tag?: "Urgent" | "Today" | "Follow-Up";
};

// ---------------------------------------------
// Page
// ---------------------------------------------

export default function DashboardPage() {
  const router = useRouter();
  const { strings: t } = useLang();

  // Auth (placeholder) — replace with your real session fetch
  const [me, setMe] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setMe({ name: data?.name || "Julia" });
        } else {
          if (isMounted) setMe({ name: "Julia" });
        }
      } catch {
        if (isMounted) setMe({ name: "Julia" });
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Demo data — swap for live data
  const stats = useMemo(
    () => [
      { label: "Active Clients", value: 18, sub: "+3 this week", Icon: Users },
      {
        label: "Jobs Scheduled",
        value: 12,
        sub: "next 7 days",
        Icon: CalendarDays,
      },
      { label: "Open Quotes", value: 5, sub: "awaiting reply", Icon: FileText },
      { label: "Invoices Due", value: 2, sub: "$420 total", Icon: DollarSign },
    ],
    []
  );

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "Call Maria about Friday reschedule",
      done: false,
      tag: "Today",
    },
    {
      id: "t2",
      title: "Email pending quote to James",
      done: true,
      tag: "Follow-Up",
    },
    { id: "t3", title: "Restock eco supplies (glass + floors)", done: false },
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "l1",
      name: "Ashley R.",
      service: "Deep Clean",
      createdAt: new Date().toISOString(),
      status: "New",
      phone: "(706) 555‑0144",
    },
    {
      id: "l2",
      name: "Bobby & Kim",
      service: "Standard",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: "Contacted",
    },
    {
      id: "l3",
      name: "UGA Startup Loft",
      service: "Office",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: "Scheduled",
      notes: "After 6pm only",
    },
  ]);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Lead["status"] | "All">("All");

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesQ = `${l.name} ${l.service} ${l.status}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesF = filter === "All" ? true : l.status === filter;
      return matchesQ && matchesF;
    });
  }, [leads, query, filter]);

  if (loading) {
    return (
      <main className="min-h-[80vh] grid place-items-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="animate-pulse text-slate-500">Loading dashboard…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-100">
      {/* Topbar */}
      <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/90 grid place-items-center text-white font-bold">
              JS
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.brand || "Julia's Shiny Houses"}
              </div>
              <div className="text-base font-semibold">Dashboard</div>
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Welcome back,{" "}
            <span className="font-medium text-slate-800 dark:text-slate-100">
              {me?.name || "Julia"}
            </span>{" "}
            ✨
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
        {/* Quick Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            label="New Quote"
            Icon={FileText}
            onClick={() => router.push("/quotes/new")}
          />
          <QuickAction
            label="Schedule Job"
            Icon={CalendarDays}
            onClick={() => router.push("/schedule/new")}
          />
          <QuickAction
            label="Add Client"
            Icon={Users}
            onClick={() => router.push("/clients/new")}
          />
          <QuickAction
            label="Record Payment"
            Icon={DollarSign}
            onClick={() => router.push("/invoices/new")}
          />
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard
              key={i}
              label={s.label}
              value={s.value}
              sub={s.sub}
              Icon={s.Icon}
            />
          ))}
        </section>

        {/* Two-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Leads */}
          <div className="lg:col-span-2">
            <CardWrapper title="Leads & Quotes">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search leads, services, status…"
                    className="w-full sm:w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-3 py-2 pl-9 text-sm outline-none focus:ring-2 ring-emerald-500/40"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 ring-emerald-500/40"
                  >
                    {(
                      [
                        "All",
                        "New",
                        "Contacted",
                        "Scheduled",
                        "Closed",
                      ] as const
                    ).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/70 dark:bg-slate-800/40 text-slate-500">
                    <tr>
                      <Th>Name</Th>
                      <Th>Service</Th>
                      <Th>Created</Th>
                      <Th>Status</Th>
                      <Th className="text-right pr-4">Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                    {filteredLeads.map((l) => (
                      <tr
                        key={l.id}
                        className="hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10 transition-colors"
                      >
                        <Td>
                          <div className="font-medium">{l.name}</div>
                          {l.phone && (
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {l.phone}
                            </div>
                          )}
                        </Td>
                        <Td>{l.service}</Td>
                        <Td>{new Date(l.createdAt).toLocaleDateString()}</Td>
                        <Td>
                          <StatusPill status={l.status} />
                        </Td>
                        <Td>
                          <div className="flex items-center justify-end gap-2 pr-2">
                            <GhostButton
                              onClick={() => router.push(`/leads/${l.id}`)}
                            >
                              View
                            </GhostButton>
                            <PrimaryButton
                              onClick={() =>
                                router.push(`/quotes/new?lead=${l.id}`)
                              }
                            >
                              Quote
                            </PrimaryButton>
                          </div>
                        </Td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-8 text-slate-500"
                        >
                          No leads match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardWrapper>
          </div>

          {/* Right: Today / Tasks */}
          <div className="lg:col-span-1 space-y-6">
            <CardWrapper title="Today">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">10:00a • Standard Clean</div>
                    <div className="text-slate-500">Mina A. — Five Points</div>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-xs bg-emerald-100 text-emerald-700 inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Confirmed
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">1:30p • Office</div>
                    <div className="text-slate-500">Downtown Suite 204</div>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-xs bg-yellow-100 text-yellow-700 inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ETA
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <PrimaryButton
                  className="w-full"
                  onClick={() => router.push("/schedule")}
                >
                  Open Schedule
                </PrimaryButton>
              </div>
            </CardWrapper>

            <CardWrapper title="Tasks">
              <ul className="space-y-2">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={(e) =>
                        setTasks((prev) =>
                          prev.map((x) =>
                            x.id === t.id ? { ...x, done: e.target.checked } : x
                          )
                        )
                      }
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span
                      className={`text-sm ${
                        t.done ? "line-through text-slate-400" : ""
                      }`}
                    >
                      {t.title}
                    </span>
                    {t.tag && (
                      <span
                        className={`ml-auto text-xs px-2 py-0.5 rounded-lg ${
                          t.tag === "Urgent"
                            ? "bg-rose-100 text-rose-700"
                            : t.tag === "Today"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {t.tag}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2">
                <PrimaryButton
                  onClick={() =>
                    setTasks((p) => [
                      {
                        id: crypto.randomUUID(),
                        title: "New task",
                        done: false,
                      },
                      ...p,
                    ])
                  }
                >
                  Add Task
                </PrimaryButton>
                <GhostButton
                  onClick={() => setTasks((p) => p.filter((x) => !x.done))}
                >
                  Clear Completed
                </GhostButton>
              </div>
            </CardWrapper>
          </div>
        </section>
      </div>
    </main>
  );
}

// ---------------------------------------------
// UI bits
// ---------------------------------------------

function QuickAction({
  label,
  onClick,
  Icon = Plus,
}: {
  label: string;
  onClick: () => void;
  Icon?: LucideIcon;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4 shadow-sm hover:shadow-md transition-all"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-emerald-500/10 to-emerald-600/10 transition-opacity" />
      <div className="relative flex items-center justify-between">
        <span className="font-semibold">{label}</span>
        <span className="h-8 w-8 grid place-items-center rounded-xl bg-emerald-500/20 text-emerald-700">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Quick action
      </div>
    </button>
  );
}

function StatCard({
  label,
  value,
  sub,
  Icon,
}: {
  label: string;
  value: number;
  sub?: string;
  Icon?: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight">
            {value}
          </div>
          {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
        </div>
        {Icon && (
          <div className="h-10 w-10 grid place-items-center rounded-xl bg-emerald-500/10">
            <Icon className="h-5 w-5 text-emerald-600" />
          </div>
        )}
      </div>
    </div>
  );
}

function CardWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`text-left text-xs font-medium uppercase tracking-wider px-4 py-3 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function StatusPill({ status }: { status: Lead["status"] }) {
  const map: Record<Lead["status"], string> = {
    New: "bg-emerald-100 text-emerald-700",
    Contacted: "bg-blue-100 text-blue-700",
    Scheduled: "bg-violet-100 text-violet-700",
    Closed: "bg-slate-200 text-slate-700",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-lg ${map[status]}`}>
      {status}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-sm font-medium shadow-sm transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
