import { useMemo, useState } from "react";
import {
  ClipboardList, Wallet, BadgeIndianRupee, Landmark, TrendingUp, Check, X, Plus,
  CalendarDays, UserRound, FileText, IndianRupee,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useCloudState } from "@/lib/cloud-state";
import { cn } from "@/lib/utils";

type RequestType = "Leave" | "Expense Claim" | "Advance Salary" | "Equipment" | "Resignation";
type RequestStatus = "Pending" | "Approved" | "Rejected";

interface StaffRequest {
  id: string;
  employee: string;
  role: string;
  type: RequestType;
  fromDate: string;
  toDate: string;
  details: string;
  status: RequestStatus;
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  basic: number;
  hra: number;
  other: number;
  pf: number;
  tax: number;
}

interface PayrollRun {
  month: string;
  employeeId: string;
  gross: number;
  deductions: number;
  net: number;
  status: "Paid" | "Pending";
}

const MONTH_FMT = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });
const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().slice(0, 10);

const EMPLOYEES: Employee[] = [
  { id: "E1", name: "Neha Gupta", role: "TGT Science", department: "Academic", basic: 48000, hra: 14000, other: 3000, pf: 5760, tax: 4200 },
  { id: "E2", name: "Arjun Iyer", role: "Admin Officer", department: "Administration", basic: 42000, hra: 12000, other: 2500, pf: 5040, tax: 3600 },
  { id: "E3", name: "Kavya Reddy", role: "Accountant", department: "Finance", basic: 45000, hra: 13000, other: 2800, pf: 5400, tax: 3900 },
  { id: "E4", name: "Rohit Sharma", role: "PT Instructor", department: "Sports", basic: 34000, hra: 10000, other: 1800, pf: 4080, tax: 2400 },
  { id: "E5", name: "Meera Krishnan", role: "Head of English", department: "Academic", basic: 56000, hra: 16000, other: 4000, pf: 6720, tax: 5600 },
  { id: "E6", name: "Sanjay Patil", role: "Lab Assistant", department: "Academic", basic: 28000, hra: 8000, other: 1200, pf: 3360, tax: 1500 },
  { id: "E7", name: "Divya Menon", role: "Counsellor", department: "Student Care", basic: 38000, hra: 11000, other: 2000, pf: 4560, tax: 2900 },
  { id: "E8", name: "Farhan Ali", role: "IT Support", department: "Technology", basic: 36000, hra: 10500, other: 2200, pf: 4320, tax: 2700 },
];

const SEED_REQUESTS: StaffRequest[] = [
  { id: "HRQ-001", employee: "Neha Gupta", role: "TGT Science", type: "Leave", fromDate: "2026-11-05", toDate: "2026-11-07", details: "Family function — three days casual leave.", status: "Pending", createdAt: "2026-11-01" },
  { id: "HRQ-002", employee: "Kavya Reddy", role: "Accountant", type: "Expense Claim", fromDate: "2026-10-28", toDate: "2026-10-28", details: "Stationery purchase — receipts attached (₹4,250).", status: "Pending", createdAt: "2026-10-30" },
  { id: "HRQ-003", employee: "Rohit Sharma", role: "PT Instructor", type: "Leave", fromDate: "2026-10-20", toDate: "2026-10-21", details: "Medical checkup.", status: "Approved", createdAt: "2026-10-18" },
];

const grossOf = (e: Employee) => e.basic + e.hra + e.other;
const deductOf = (e: Employee) => e.pf + e.tax;
const netOf = (e: Employee) => grossOf(e) - deductOf(e);

function Badge({ status }: { status: string }) {
  const tone =
    /approved|paid/i.test(status) ? "bg-success/10 text-success"
    : /pending/i.test(status) ? "bg-warning/15 text-warning"
    : "bg-destructive/10 text-destructive";
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", tone)}>{status}</span>;
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn("rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-primary-gradient text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
      {children}
    </button>
  );
}

const th = "px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";
const td = "px-4 py-3 text-sm";

export function HRModule() {
  const [tab, setTab] = useState<"requests" | "payroll">("requests");
  const [requests, setRequests] = useCloudState<StaffRequest[]>("hr.requests", SEED_REQUESTS);
  const [payroll, setPayroll] = useCloudState<PayrollRun[]>("hr.payroll", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    employee: EMPLOYEES[0]!.name, type: "Leave" as RequestType, fromDate: today(), toDate: today(), details: "",
  });
  const [filter, setFilter] = useState<"All" | RequestStatus>("All");

  const month = MONTH_FMT.format(new Date());
  const pending = requests.filter((r) => r.status === "Pending");
  const monthlyNet = EMPLOYEES.reduce((s, e) => s + netOf(e), 0);
  const paidCount = payroll.filter((p) => p.status === "Paid").length;

  const visibleRequests = useMemo(
    () => (filter === "All" ? requests : requests.filter((r) => r.status === filter)),
    [requests, filter],
  );

  const submitRequest = () => {
    if (!form.details.trim()) return;
    const emp = EMPLOYEES.find((e) => e.name === form.employee)!;
    const next = (requests.reduce((m, r) => Math.max(m, Number(r.id.match(/(\d+)$/)?.[1]) || 0), 0) + 1);
    setRequests((prev) => [{
      id: `HRQ-${String(next).padStart(3, "0")}`,
      employee: form.employee, role: emp.role, type: form.type,
      fromDate: form.fromDate, toDate: form.toDate, details: form.details.trim(),
      status: "Pending", createdAt: today(),
    }, ...prev]);
    setForm({ ...form, details: "" });
    setShowForm(false);
  };

  const decide = (id: string, status: RequestStatus) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const runPayroll = () =>
    setPayroll(EMPLOYEES.map((e) => ({
      month, employeeId: e.id, gross: grossOf(e), deductions: deductOf(e), net: netOf(e), status: "Pending" as const,
    })));

  const markPaid = () => setPayroll((prev) => prev.map((p) => ({ ...p, status: "Paid" as const })));

  return (
    <AppShell title="HR">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Employees", value: String(EMPLOYEES.length), note: "Active staff" },
          { label: "Open Requests", value: String(pending.length), note: "Awaiting approval" },
          { label: "Net Payroll / month", value: money(monthlyNet), note: month },
          { label: "Paid this month", value: `${paidCount}/${EMPLOYEES.length}`, note: payroll.length ? "Payroll run" : "Not run yet" },
        ].map((s, i) => (
          <div key={s.label} className="fade-up card-fx rounded-2xl border bg-card p-5 shadow-card" style={{ animationDelay: `${i * 90}ms` }}>
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <div className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Icon i={i} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{s.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-1 rounded-xl border bg-card p-1.5 shadow-card w-fit">
        <Chip active={tab === "requests"} onClick={() => setTab("requests")}><span className="inline-flex items-center gap-1.5"><ClipboardList className="size-4" />Requests</span></Chip>
        <Chip active={tab === "payroll"} onClick={() => setTab("payroll")}><span className="inline-flex items-center gap-1.5"><Wallet className="size-4" />Payroll</span></Chip>
      </div>

      {tab === "requests" && (
        <div className="fade-up mt-4 rounded-2xl border bg-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
            <div>
              <p className="font-bold">Staff Requests</p>
              <p className="text-xs text-muted-foreground">Leave, expense claims, advances and more</p>
            </div>
            <div className="flex items-center gap-2">
              <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="h-9 rounded-lg border bg-background px-2.5 text-sm">
                {(["All", "Pending", "Approved", "Rejected"] as const).map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-lg bg-primary-gradient px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95">
                <Plus className="size-4" />New Request
              </button>
            </div>
          </div>

          {showForm && (
            <div className="border-b bg-accent/30 px-5 py-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="text-xs font-medium text-muted-foreground">Employee
                  <select value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} className="mt-1 h-9 w-full rounded-lg border bg-background px-2.5 text-sm font-normal text-foreground">
                    {EMPLOYEES.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
                  </select>
                </label>
                <label className="text-xs font-medium text-muted-foreground">Type
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as RequestType })} className="mt-1 h-9 w-full rounded-lg border bg-background px-2.5 text-sm font-normal text-foreground">
                    {(["Leave", "Expense Claim", "Advance Salary", "Equipment", "Resignation"] as const).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
                <label className="text-xs font-medium text-muted-foreground">From
                  <input type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} className="mt-1 h-9 w-full rounded-lg border bg-background px-2.5 text-sm font-normal text-foreground" />
                </label>
                <label className="text-xs font-medium text-muted-foreground">To
                  <input type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} className="mt-1 h-9 w-full rounded-lg border bg-background px-2.5 text-sm font-normal text-foreground" />
                </label>
              </div>
              <label className="mt-3 block text-xs font-medium text-muted-foreground">Details
                <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={2} placeholder="Describe the request…" className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal text-foreground" />
              </label>
              <div className="mt-3 flex gap-2">
                <button onClick={submitRequest} className="rounded-lg bg-primary-gradient px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Submit Request</button>
                <button onClick={() => setShowForm(false)} className="rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent">Cancel</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="border-b bg-accent/40">
                <tr>
                  {["Request", "Type", "Dates", "Details", "Status", "Action"].map((l) => (
                    <th key={l} className={th}>{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRequests.map((r) => (
                  <tr key={r.id} className="row-fx border-b last:border-0">
                    <td className={td}>
                      <p className="font-semibold">{r.employee}</p>
                      <p className="text-xs text-muted-foreground">{r.id} · {r.role}</p>
                    </td>
                    <td className={td}>{r.type}</td>
                    <td className={cn(td, "text-xs text-muted-foreground")}>{r.fromDate === r.toDate ? r.fromDate : `${r.fromDate} → ${r.toDate}`}</td>
                    <td className={cn(td, "max-w-[260px] truncate text-xs text-muted-foreground")} title={r.details}>{r.details}</td>
                    <td className={td}><Badge status={r.status} /></td>
                    <td className={td}>
                      {r.status === "Pending" ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => decide(r.id, "Approved")} className="flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1.5 text-xs font-semibold text-success hover:bg-success/20"><Check className="size-3.5" />Approve</button>
                          <button onClick={() => decide(r.id, "Rejected")} className="flex items-center gap-1 rounded-lg bg-destructive/10 px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"><X className="size-3.5" />Reject</button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {visibleRequests.length === 0 && (
                  <tr><td colSpan={6} className={cn(td, "py-8 text-center text-muted-foreground")}>No {filter.toLowerCase()} requests.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "payroll" && (
        <>
          <div className="fade-up mt-4 grid gap-4 lg:grid-cols-3">
            <div className="card-fx rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 text-sm font-bold"><Wallet className="size-4 text-primary" />Gross Payroll</div>
              <p className="mt-2 text-2xl font-extrabold tracking-tight">{money(EMPLOYEES.reduce((s, e) => s + grossOf(e), 0))}</p>
              <p className="mt-1 text-xs text-muted-foreground">Basic + HRA + allowances · {month}</p>
            </div>
            <div className="card-fx rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 text-sm font-bold"><Landmark className="size-4 text-primary" />Total Deductions</div>
              <p className="mt-2 text-2xl font-extrabold tracking-tight">{money(EMPLOYEES.reduce((s, e) => s + deductOf(e), 0))}</p>
              <p className="mt-1 text-xs text-muted-foreground">PF + professional tax</p>
            </div>
            <div className="card-fx rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 text-sm font-bold"><IndianRupee className="size-4 text-primary" />Net Payable</div>
              <p className="mt-2 text-2xl font-extrabold tracking-tight">{money(monthlyNet)}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><TrendingUp className="size-3 text-success" />Disbursed on the 1st of next month</p>
            </div>
          </div>

          <div className="fade-up mt-4 rounded-2xl border bg-card shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
              <div>
                <p className="font-bold">Payroll — {month}</p>
                <p className="text-xs text-muted-foreground">{payroll.length ? "Run generated. Review and mark as paid." : "No payroll run yet for this month."}</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="h-9 rounded-lg border bg-background px-2.5 text-sm" defaultValue={month}>
                  <option>{month}</option>
                </select>
                {payroll.length === 0 ? (
                  <button onClick={runPayroll} className="flex items-center gap-1.5 rounded-lg bg-primary-gradient px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95">
                    <Wallet className="size-4" />Run Payroll
                  </button>
                ) : paidCount < payroll.length ? (
                  <button onClick={markPaid} className="flex items-center gap-1.5 rounded-lg bg-success/15 px-4 py-2 text-sm font-semibold text-success hover:bg-success/25">
                    <Check className="size-4" />Mark All Paid
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-lg bg-success/10 px-4 py-2 text-sm font-semibold text-success"><Check className="size-4" />Paid</span>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead className="border-b bg-accent/40">
                  <tr>{["Employee", "Department", "Basic", "HRA", "Allowances", "Deductions", "Net Pay", "Status"].map((l) => <th key={l} className={th}>{l}</th>)}</tr>
                </thead>
                <tbody>
                  {(payroll.length ? EMPLOYEES.filter((e) => payroll.some((p) => p.employeeId === e.id)) : EMPLOYEES).map((e) => {
                    const run = payroll.find((p) => p.employeeId === e.id);
                    return (
                      <tr key={e.id} className="row-fx border-b last:border-0">
                        <td className={td}>
                          <p className="font-semibold">{e.name}</p>
                          <p className="text-xs text-muted-foreground">{e.role}</p>
                        </td>
                        <td className={cn(td, "text-xs text-muted-foreground")}>{e.department}</td>
                        <td className={td}>{money(e.basic)}</td>
                        <td className={td}>{money(e.hra)}</td>
                        <td className={td}>{money(e.other)}</td>
                        <td className={cn(td, "text-destructive")}>-{money(deductOf(e))}</td>
                        <td className={cn(td, "font-bold")}>{money(netOf(e))}</td>
                        <td className={td}>{run ? <Badge status={run.status} /> : <span className="text-xs text-muted-foreground">Not run</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

function Icon({ i }: { i: number }) {
  const icons = [UserRound, ClipboardList, Wallet, BadgeIndianRupee];
  const Icon = icons[i]!;
  return <Icon className="size-5" />;
}
