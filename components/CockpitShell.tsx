"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

/* ── types ──────────────────────────────────────────────── */
type ViewMode = "grid" | "list";
type SectionKey = "all" | "alerts" | "winback" | "reports" | "wbtools";

/* ── data ────────────────────────────────────────────────── */
const SLACK_ALERTS = [
  {
    id: "draft-deadline",
    icon: "🔔",
    iconBg: "var(--slate-bg)",
    name: "Draft Deadline Alerts",
    desc: "Tasks nearing due date — automated Slack notifications",
    alertLabel: "Deadline alerts auto-posted",
    alertSub: "#pet-pro-draft-deadline-alerts",
    ctaText: "Automated alerts posted to Slack",
    href: "https://luxurypresence.enterprise.slack.com/archives/C0B2N9Z27RC",
  },
  {
    id: "wb-report",
    icon: "📊",
    iconBg: "var(--navy-bg)",
    name: "WB Report Alerts",
    desc: "Website Drafts report by Web Builders — Slack channel",
    alertLabel: "WB reports auto-posted",
    alertSub: "#wb-report-alerts",
    ctaText: "Website Drafts by Web Builders — automated",
    href: "https://luxurypresence.enterprise.slack.com/archives/C0B0K5S8V6C",
  },
];

const ARTIFACTS = [
  {
    id: "tl-report",
    icon: "📝",
    iconBg: "var(--slate-bg)",
    name: "TL Report Generator",
    desc: "Team Lead reports and performance tracking",
    detail: "Generate structured TL reports with performance data and team tracking. Streamlines the weekly reporting process for Team Leaders.",
    slackHref: null,
    slackLabel: null,
    btnLabel: "Open TL Report Generator",
    btnBg: "var(--teal-bg)",
    btnColor: "var(--teal)",
    btnBorder: "var(--teal-border)",
    href: "https://claude.ai/artifacts/latest/fa2d6f56-8013-45ff-914b-75512e1c36d6",
  },
  {
    id: "workforce-hub",
    icon: "👥",
    iconBg: "var(--navy-bg)",
    name: "WB Available Workforce Hub",
    desc: "Member status report per TL",
    detail: "View and export the availability status for each Web Builder per Team Leader. Track team capacity at a glance.",
    slackHref: null,
    slackLabel: null,
    btnLabel: "Open Workforce Hub",
    btnBg: "var(--navy-bg)",
    btnColor: "var(--navy)",
    btnBorder: "var(--navy-border)",
    href: "https://claude.ai/artifacts/latest/f9165fa0-07ba-4a7b-b166-5c46c6c6470d",
  },
  {
    id: "eow-reviewer",
    icon: "📈",
    iconBg: "var(--violet-bg)",
    name: "EOW Performance Reviewer",
    desc: "Upload a CSV to generate team reports",
    detail: "Upload a CSV file to automatically generate end-of-week performance reports for the team. Fast turnaround on weekly reviews.",
    slackHref: null,
    slackLabel: null,
    btnLabel: "Open EOW Reviewer",
    btnBg: "var(--violet-bg)",
    btnColor: "var(--violet)",
    btnBorder: "var(--violet-border)",
    href: "https://claude.ai/artifacts/latest/147ad270-1873-4e2c-b241-2afdd210bb3c",
  },
  {
    id: "dpc-dpa-report",
    icon: "📋",
    iconBg: "var(--amber-bg)",
    name: "PRO DPC/DPA Daily Report",
    desc: "Send priority tasks to the PRO team Slack channel",
    detail: "Generate and send the daily DPC/DPA prioritization report directly to the PRO team channel. Keeps the team aligned on daily task priorities.",
    slackHref: "https://luxurypresence.enterprise.slack.com/archives/C07UQNJDCF5",
    slackLabel: "Open Slack Channel ↗",
    btnLabel: "Open Daily Report",
    btnBg: "var(--amber-bg)",
    btnColor: "var(--amber)",
    btnBorder: "1px solid color-mix(in srgb, var(--amber) 30%, transparent)",
    href: "https://claude.ai/artifacts/latest/15e22021-da20-442d-8ab9-b65df6784c1c",
  },
];

const WB_TOOLS = [
  {
    id: "self-qa",
    icon: "🔍",
    iconBg: "var(--teal-bg)",
    name: "LP Self QA Tool",
    desc: "Self quality review tool for Web Builders",
    detail: "Self-service QA checklist for Web Builders to review their own work before submission. Standardizes the QA process across the team.",
    chip: "Vercel" as const,
    btnLabel: "Open Self QA Tool",
    btnBg: "var(--teal-bg)",
    btnColor: "var(--teal)",
    btnBorder: "var(--teal-border)",
    href: "https://lp-selfqa-tool.vercel.app/",
  },
  {
    id: "reference-sites",
    icon: "🌐",
    iconBg: "var(--navy-bg)",
    name: "LP Reference Sites",
    desc: "LP reference sites resource for Web Builders",
    detail: "Curated Luxury Presence reference sites for design and development decisions. Inspiration and standards in one place.",
    chip: "Coda" as const,
    btnLabel: "Open Reference Sites",
    btnBg: "var(--navy-bg)",
    btnColor: "var(--navy)",
    btnBorder: "var(--navy-border)",
    href: "https://coda.io/d/PET_dw29ymOu-V8/LP-Reference-Sites_suFkq-po#_lu3j8kUw",
  },
];

const NAV_ITEMS: { key: SectionKey; label: string; icon: string; count: number }[] = [
  { key: "all",     label: "All Tools",        icon: "🚀", count: 9 },
  { key: "alerts",  label: "Alerts & Reports",  icon: "🔔", count: 2 },
  { key: "winback", label: "Win Back Sites",    icon: "🔄", count: 1 },
  { key: "reports", label: "TL Reports",        icon: "📊", count: 4 },
  { key: "wbtools", label: "WBs Performance",   icon: "⚡", count: 2 },
];

/* ── chip variants ───────────────────────────────────────── */
type ChipVariant = "slack" | "coda" | "claude" | "vercel";

function Chip({ label, variant }: { label: string; variant: ChipVariant }) {
  const s: Record<ChipVariant, React.CSSProperties> = {
    slack:  { background: "var(--violet-bg)", color: "var(--violet)" },
    coda:   { background: "var(--navy-bg)",   color: "var(--navy)" },
    claude: { background: "var(--teal-bg)",   color: "var(--teal)" },
    vercel: { background: "var(--teal-bg)",   color: "var(--teal)" },
  };
  return (
    <span className="shrink-0 text-[10px] font-bold tracking-[0.6px] uppercase px-2.5 py-0.5 rounded-[5px]" style={s[variant]}>
      {label}
    </span>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-3.5">
      <span className="text-[10.5px] font-bold tracking-[1.5px] uppercase whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
        {text}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

/* ── alert cards ─────────────────────────────────────────── */
function AlertCardGrid({ item }: { item: typeof SLACK_ALERTS[0] }) {
  return (
    <div className="rounded-xl border overflow-hidden transition-all duration-200 hover:-translate-y-px hover:shadow-md" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between gap-2.5 px-[18px] py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-start gap-2.5">
          <div className="w-[34px] h-[34px] rounded-[7px] flex items-center justify-center text-[15px] shrink-0" style={{ background: item.iconBg }}>{item.icon}</div>
          <div>
            <div className="text-[14px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{item.name}</div>
            <div className="mt-0.5 text-[12px] leading-snug" style={{ color: "var(--text-secondary)" }}>{item.desc}</div>
          </div>
        </div>
        <Chip label="Slack" variant="slack" />
      </div>
      <div className="px-[18px] py-4 space-y-2.5">
        <div className="text-[10px] font-bold tracking-[1px] uppercase" style={{ color: "var(--text-muted)" }}>Status</div>
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
          <span className="w-[7px] h-[7px] rounded-full bg-green-500 shrink-0 pulse-dot" />
          <div>
            <div className="text-[12.5px] font-semibold" style={{ color: "var(--text-primary)" }}>{item.alertLabel}</div>
            <div className="text-[11px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>{item.alertSub}</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border" style={{ background: "var(--violet-bg)", borderColor: "var(--violet-border)" }}>
          <span className="text-base">💬</span>
          <span className="flex-1 text-[11.5px] font-medium" style={{ color: "var(--violet)" }}>{item.ctaText}</span>
          <a href={item.href} target="_blank" rel="noopener noreferrer"
            className="shrink-0 text-[11.5px] font-bold px-3 py-1 rounded-[5px] border transition-all duration-150 hover:opacity-80 no-underline"
            style={{ color: "var(--violet)", background: "var(--surface)", borderColor: "var(--violet-border)" }}>
            Open Channel ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function AlertCardList({ item }: { item: typeof SLACK_ALERTS[0] }) {
  return (
    <div className="rounded-xl border flex items-center gap-4 px-5 py-3.5 transition-all duration-200 hover:-translate-y-px hover:shadow-md" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="w-9 h-9 rounded-[7px] flex items-center justify-center text-[16px] shrink-0" style={{ background: item.iconBg }}>{item.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{item.name}</div>
        <div className="text-[11.5px] mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>{item.desc}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="w-[7px] h-[7px] rounded-full bg-green-500 pulse-dot" />
        <span className="text-[11px] font-medium hidden sm:block" style={{ color: "var(--text-muted)" }}>{item.alertSub}</span>
      </div>
      <Chip label="Slack" variant="slack" />
      <a href={item.href} target="_blank" rel="noopener noreferrer"
        className="shrink-0 text-[11.5px] font-bold px-3 py-1.5 rounded-[6px] border transition-all duration-150 hover:opacity-80 no-underline"
        style={{ color: "var(--violet)", background: "var(--violet-bg)", borderColor: "var(--violet-border)" }}>
        Open ↗
      </a>
    </div>
  );
}

/* ── winback cards ───────────────────────────────────────── */
function WinBackCardGrid() {
  return (
    <div className="rounded-xl border overflow-hidden transition-all duration-200 hover:-translate-y-px hover:shadow-md" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between gap-2.5 px-[18px] py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-start gap-2.5">
          <div className="w-[34px] h-[34px] rounded-[7px] flex items-center justify-center text-[15px] shrink-0" style={{ background: "var(--navy-bg)" }}>🔄</div>
          <div>
            <div className="text-[14px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Win Back Sites</div>
            <div className="mt-0.5 text-[12px] leading-snug" style={{ color: "var(--text-secondary)" }}>Win back site tracking — Website Drafts by Web Builder in Coda</div>
          </div>
        </div>
        <Chip label="Coda" variant="coda" />
      </div>
      <div className="px-[18px] py-4">
        <a href="https://coda.io/d/PET_dw29ymOu-V8/Win-Back-Sites_suc3ZPM8?docIds%5B0%5D=w29ymOu-V8&search=rochelle#_lur6huqk"
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-3 rounded-lg border transition-all duration-150 no-underline"
          style={{ background: "var(--surface-alt)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
          <span className="text-base">📋</span>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Win Back Sites Report</div>
            <div className="text-[11px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>WD tracking by Web Builder · Coda Doc</div>
          </div>
          <span className="ml-auto text-[13px]" style={{ color: "var(--text-muted)" }}>↗</span>
        </a>
      </div>
    </div>
  );
}

function WinBackCardList() {
  return (
    <a href="https://coda.io/d/PET_dw29ymOu-V8/Win-Back-Sites_suc3ZPM8?docIds%5B0%5D=w29ymOu-V8&search=rochelle#_lur6huqk"
      target="_blank" rel="noopener noreferrer"
      className="rounded-xl border flex items-center gap-4 px-5 py-3.5 transition-all duration-200 hover:-translate-y-px hover:shadow-md no-underline"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="w-9 h-9 rounded-[7px] flex items-center justify-center text-[16px] shrink-0" style={{ background: "var(--navy-bg)" }}>🔄</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Win Back Sites</div>
        <div className="text-[11.5px] mt-0.5" style={{ color: "var(--text-secondary)" }}>Win back site tracking — Website Drafts by Web Builder in Coda</div>
      </div>
      <Chip label="Coda" variant="coda" />
      <span className="text-[13px] shrink-0" style={{ color: "var(--text-muted)" }}>↗</span>
    </a>
  );
}

/* ── artifact cards ──────────────────────────────────────── */
function ArtifactCardGrid({ item }: { item: typeof ARTIFACTS[0] }) {
  return (
    <div className="rounded-xl border overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-px hover:shadow-md" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between gap-2.5 px-4 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-[7px] flex items-center justify-center text-[15px] shrink-0" style={{ background: item.iconBg }}>{item.icon}</div>
          <div>
            <div className="text-[13px] font-bold tracking-tight leading-snug" style={{ color: "var(--text-primary)" }}>{item.name}</div>
            <div className="mt-0.5 text-[11.5px] leading-snug" style={{ color: "var(--text-secondary)" }}>{item.desc}</div>
          </div>
        </div>
        <Chip label="Claude" variant="claude" />
      </div>
      <div className="px-4 py-3.5 flex flex-col gap-3 flex-1">
        <p className="text-[11.5px] leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>{item.detail}</p>
        {item.slackHref && (
          <a href={item.slackHref} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-[11px] font-semibold no-underline hover:opacity-80 transition-opacity"
            style={{ color: "var(--violet)" }}>
            <span>💬</span> {item.slackLabel}
          </a>
        )}
        <a href={item.href} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-[12px] font-bold tracking-[0.2px] px-3 py-2.5 rounded-[7px] transition-all duration-150 hover:opacity-80 no-underline"
          style={{ background: item.btnBg, color: item.btnColor, border: `1px solid ${item.btnBorder}` }}>
          {item.icon} {item.btnLabel} ↗
        </a>
      </div>
    </div>
  );
}

function ArtifactCardList({ item }: { item: typeof ARTIFACTS[0] }) {
  return (
    <div className="rounded-xl border flex items-center gap-4 px-5 py-3.5 transition-all duration-200 hover:-translate-y-px hover:shadow-md" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="w-9 h-9 rounded-[7px] flex items-center justify-center text-[16px] shrink-0" style={{ background: item.iconBg }}>{item.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{item.name}</div>
        <div className="text-[11.5px] mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>{item.desc}</div>
      </div>
      {item.slackHref && (
        <a href={item.slackHref} target="_blank" rel="noopener noreferrer"
          className="shrink-0 text-[11px] font-semibold px-2.5 py-1.5 rounded-[6px] border transition-all duration-150 hover:opacity-80 no-underline hidden sm:flex items-center gap-1"
          style={{ color: "var(--violet)", background: "var(--violet-bg)", borderColor: "var(--violet-border)" }}>
          💬 Slack
        </a>
      )}
      <Chip label="Claude" variant="claude" />
      <a href={item.href} target="_blank" rel="noopener noreferrer"
        className="shrink-0 text-[11.5px] font-bold px-3 py-1.5 rounded-[6px] border transition-all duration-150 hover:opacity-80 no-underline"
        style={{ color: item.btnColor, background: item.btnBg, border: `1px solid ${item.btnBorder}` }}>
        Open ↗
      </a>
    </div>
  );
}

/* ── wb tool cards ───────────────────────────────────────── */
function WBToolCardGrid({ item }: { item: typeof WB_TOOLS[0] }) {
  return (
    <div className="rounded-xl border overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-px hover:shadow-md" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between gap-2.5 px-4 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-[7px] flex items-center justify-center text-[15px] shrink-0" style={{ background: item.iconBg }}>{item.icon}</div>
          <div>
            <div className="text-[13px] font-bold tracking-tight leading-snug" style={{ color: "var(--text-primary)" }}>{item.name}</div>
            <div className="mt-0.5 text-[11.5px] leading-snug" style={{ color: "var(--text-secondary)" }}>{item.desc}</div>
          </div>
        </div>
        <Chip label={item.chip} variant={item.chip.toLowerCase() as ChipVariant} />
      </div>
      <div className="px-4 py-3.5 flex flex-col gap-3 flex-1">
        <p className="text-[11.5px] leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>{item.detail}</p>
        <a href={item.href} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-[12px] font-bold tracking-[0.2px] px-3 py-2.5 rounded-[7px] transition-all duration-150 hover:opacity-80 no-underline"
          style={{ background: item.btnBg, color: item.btnColor, border: `1px solid ${item.btnBorder}` }}>
          {item.icon} {item.btnLabel} ↗
        </a>
      </div>
    </div>
  );
}

function WBToolCardList({ item }: { item: typeof WB_TOOLS[0] }) {
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer"
      className="rounded-xl border flex items-center gap-4 px-5 py-3.5 transition-all duration-200 hover:-translate-y-px hover:shadow-md no-underline"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="w-9 h-9 rounded-[7px] flex items-center justify-center text-[16px] shrink-0" style={{ background: item.iconBg }}>{item.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{item.name}</div>
        <div className="text-[11.5px] mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>{item.desc}</div>
      </div>
      <Chip label={item.chip} variant={item.chip.toLowerCase() as ChipVariant} />
      <span className="text-[13px] shrink-0" style={{ color: "var(--text-muted)" }}>↗</span>
    </a>
  );
}

/* ── theme toggle ────────────────────────────────────────── */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="flex rounded-[7px] overflow-hidden border" style={{ background: "var(--surface)", borderColor: "var(--border-strong)" }}>
      {(["dark", "light"] as const).map((t) => (
        <button key={t} onClick={() => setTheme(t)}
          className="px-3 py-1.5 text-[12px] font-semibold tracking-[0.4px] flex items-center gap-1.5 transition-all duration-150 cursor-pointer border-none outline-none"
          style={theme === t ? { background: "var(--text-primary)", color: "var(--bg)" } : { background: "transparent", color: "var(--text-muted)" }}>
          {t === "dark" ? "🌙" : "☀️"} {t === "dark" ? "Dark" : "Light"}
        </button>
      ))}
    </div>
  );
}

/* ── view toggle ─────────────────────────────────────────── */
function ViewToggle({ view, setView }: { view: ViewMode; setView: (v: ViewMode) => void }) {
  return (
    <div className="flex rounded-[7px] overflow-hidden border" style={{ background: "var(--surface)", borderColor: "var(--border-strong)" }}>
      {(["grid", "list"] as const).map((v) => (
        <button key={v} onClick={() => setView(v)}
          className="px-3 py-1.5 text-[12px] font-semibold flex items-center gap-1.5 transition-all duration-150 cursor-pointer border-none outline-none"
          style={view === v ? { background: "var(--text-primary)", color: "var(--bg)" } : { background: "transparent", color: "var(--text-muted)" }}>
          {v === "grid" ? (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="0" y="0" width="5.5" height="5.5" rx="1.2" fill="currentColor"/>
              <rect x="7.5" y="0" width="5.5" height="5.5" rx="1.2" fill="currentColor"/>
              <rect x="0" y="7.5" width="5.5" height="5.5" rx="1.2" fill="currentColor"/>
              <rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1.2" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="0" y="1" width="13" height="2.5" rx="1.2" fill="currentColor"/>
              <rect x="0" y="5.25" width="13" height="2.5" rx="1.2" fill="currentColor"/>
              <rect x="0" y="9.5" width="13" height="2.5" rx="1.2" fill="currentColor"/>
            </svg>
          )}
          {v === "grid" ? "Grid" : "List"}
        </button>
      ))}
    </div>
  );
}

/* ── main shell ──────────────────────────────────────────── */
export function CockpitShell() {
  const [section, setSection] = useState<SectionKey>("all");
  const [view, setView] = useState<ViewMode>("grid");

  const show = (key: SectionKey) => section === "all" || section === key;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── SIDEBAR ── */}
      <aside className="w-[200px] shrink-0 border-r flex flex-col sticky top-0 h-screen overflow-y-auto"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}>

        <div className="px-5 pt-6 pb-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] flex items-center justify-center font-serif font-bold text-[14px] shrink-0"
              style={{ background: "var(--lp-mark-bg)", color: "var(--lp-mark-txt)" }}>LP</div>
            <div>
              <div className="text-[13px] font-bold tracking-tight leading-none" style={{ color: "var(--text-primary)" }}>TL Cockpit</div>
              <div className="mt-0.5 text-[9.5px] font-medium tracking-[1px] uppercase" style={{ color: "var(--text-muted)" }}>PET Team</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="text-[9px] font-bold tracking-[1.5px] uppercase px-2 mb-2.5" style={{ color: "var(--text-muted)" }}>
            Filter by
          </div>
          {NAV_ITEMS.map((item) => (
            <button key={item.key} onClick={() => setSection(item.key)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left mb-0.5 transition-all duration-150 cursor-pointer border-none outline-none"
              style={section === item.key
                ? { background: "var(--navy-bg)", color: "var(--navy)" }
                : { background: "transparent", color: "var(--text-secondary)" }}>
              <span className="text-[14px] shrink-0">{item.icon}</span>
              <span className="text-[12.5px] font-medium flex-1 text-left">{item.label}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px]"
                style={section === item.key
                  ? { background: "var(--navy-border)", color: "var(--navy)" }
                  : { background: "var(--surface-alt)", color: "var(--text-muted)" }}>
                {item.count}
              </span>
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>PET Team</div>
          <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Luxury Presence</div>
          <div className="text-[10px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>Updated Jun 2026</div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 min-w-0 flex flex-col">

        <header className="sticky top-0 z-10 flex items-center justify-between px-7 py-4 border-b"
          style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
          <div>
            <div className="text-[18px] font-bold tracking-tight leading-none" style={{ color: "var(--text-primary)" }}>
              {NAV_ITEMS.find(n => n.key === section)?.label ?? "All Tools"}
            </div>
            <div className="mt-1 text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
              Central hub for team tools, alerts &amp; resources
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <ViewToggle view={view} setView={setView} />
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] text-[11px] font-semibold tracking-[0.8px] uppercase border"
              style={{ background: "var(--surface)", borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot shrink-0" />
              Live
            </div>
          </div>
        </header>

        <main className="flex-1 px-7 py-6 pb-14">

          {show("alerts") && (
            <section className="mb-6">
              <SectionLabel text="Alerts & Reports — Auggie Automations (Slack)" />
              {view === "grid" ? (
                <div className="grid grid-cols-2 gap-4">
                  {SLACK_ALERTS.map(item => <AlertCardGrid key={item.id} item={item} />)}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {SLACK_ALERTS.map(item => <AlertCardList key={item.id} item={item} />)}
                </div>
              )}
            </section>
          )}

          {show("winback") && (
            <section className="mb-6">
              <SectionLabel text="Win Back Sites — Coda Docs & Projects" />
              {view === "grid" ? (
                <div className="grid grid-cols-2 gap-4">
                  <WinBackCardGrid />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <WinBackCardList />
                </div>
              )}
            </section>
          )}

          {show("reports") && (
            <section className="mb-6">
              <SectionLabel text="TL Reports — Claude Artifacts" />
              {view === "grid" ? (
                <div className="grid grid-cols-3 gap-4">
                  {ARTIFACTS.map(item => <ArtifactCardGrid key={item.id} item={item} />)}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {ARTIFACTS.map(item => <ArtifactCardList key={item.id} item={item} />)}
                </div>
              )}
            </section>
          )}

          {show("wbtools") && (
            <section className="mb-6">
              <SectionLabel text="Contributions to WBs Performance" />
              {view === "grid" ? (
                <div className="grid grid-cols-3 gap-4">
                  {WB_TOOLS.map(item => <WBToolCardGrid key={item.id} item={item} />)}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {WB_TOOLS.map(item => <WBToolCardList key={item.id} item={item} />)}
                </div>
              )}
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
