import { useMemo, useState } from "react";
import { Plus, Printer, Save, GraduationCap } from "lucide-react";
import { useCloudState } from "@/lib/cloud-state";
import { cn } from "@/lib/utils";

type ConcessionType = "Percentage" | "Fixed Amount" | "Special Case";
type ApproverKey = "salesHead" | "manager" | "director";
interface Signature { name: string; at: string }
interface ConcessionRecord {
  id: string;
  date: string;
  studentName: string;
  branch: string;
  applicationNo: string;
  contact: string;
  course: string;
  duration: string;
  startingDate: string;
  totalFees: number;
  amountPaid: number;
  type: ConcessionType;
  discount: number;
  netPayable: number;
  reason: string;
  studentSign: string;
  salesHead: Signature | null;
  manager: Signature | null;
  director: Signature | null;
}

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().slice(0, 10);
const nowStamp = () => new Date().toISOString().replace("T", " ").slice(0, 16);

const inputCls = "mt-1 h-9 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";

const APPROVERS: { key: ApproverKey; title: string; short: string }[] = [
  { key: "salesHead", title: "Sales Head", short: "SH" },
  { key: "manager", title: "Manager", short: "M" },
  { key: "director", title: "Director & CEO", short: "CEO" },
];

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold text-foreground">{label}</p>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3">
        <p className="text-sm font-bold uppercase tracking-wide text-skill-accent">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

interface FormState {
  date: string;
  studentName: string;
  branch: string;
  applicationNo: string;
  contact: string;
  course: string;
  duration: string;
  startingDate: string;
  totalFees: number;
  amountPaid: number;
  type: ConcessionType;
  discount: number;
  reason: string;
  studentSign: string;
}

function emptyForm(): FormState {
  return {
    date: today(), studentName: "", branch: "", applicationNo: "", contact: "",
    course: "", duration: "", startingDate: "", totalFees: 0, amountPaid: 0,
    type: "Percentage", discount: 0, reason: "", studentSign: "",
  };
}

function computeNet(total: number, type: ConcessionType, discount: number): number {
  if (!total || !discount) return total || 0;
  if (type === "Percentage") return Math.max(0, Math.round(total * (1 - discount / 100)));
  if (type === "Fixed Amount") return Math.max(0, total - discount);
  return total;
}

export function FeeConcessionForm() {
  const [records, setRecords] = useCloudState<ConcessionRecord[]>("admission.fee-concessions", []);
  const [form, setForm] = useState<FormState>(emptyForm);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const net = useMemo(() => computeNet(form.totalFees, form.type, form.discount), [form.totalFees, form.type, form.discount]);
  const nextId = `FC-${String(records.length + 1).padStart(4, "0")}`;
  const canSave = Boolean(form.studentName.trim() && form.course.trim() && form.reason.trim());

  const save = () => {
    if (!canSave) return;
    setRecords((prev) => [...prev, {
      ...form, id: nextId, netPayable: net,
      salesHead: null, manager: null, director: null,
    }]);
    setForm(emptyForm());
  };

  const sign = (id: string, key: ApproverKey) =>
    setRecords((prev) => prev.map((r) => (r.id === id
      ? { ...r, [key]: { name: "Praneeth", at: nowStamp() } } : r)));

  const loadForEdit = (r: ConcessionRecord) => {
    const { id: _id, netPayable: _net, salesHead: _s, manager: _m, director: _d, ...rest } = r;
    setForm(rest);
    setRecords((prev) => prev.filter((x) => x.id !== r.id));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="text-center">
          <p className="inline-flex items-baseline gap-0.5 text-3xl font-extrabold tracking-tight">
            <span className="text-foreground">Skill</span><span className="text-skill-accent">AI</span>
            <GraduationCap className="size-6 translate-y-0.5 text-skill-accent" />
          </p>
          <p className="text-[11px] font-semibold tracking-[0.35em] text-muted-foreground">LEARN SKILL GET JOB</p>
          <h2 className="mt-3 text-xl font-extrabold tracking-tight">FEE CONCESSION FORM</h2>
          <div className="mt-4 grid gap-3 text-left sm:grid-cols-2">
            <div className="rounded-lg bg-accent/60 px-4 py-2.5">
              <p className="text-xs font-bold uppercase tracking-wide text-skill-accent">Concession No.</p>
              <p className="text-sm font-semibold">{nextId}</p>
            </div>
            <div className="rounded-lg bg-accent/60 px-4 py-2.5">
              <p className="text-xs font-bold uppercase tracking-wide text-skill-accent">Date</p>
              <p className="text-sm font-semibold">{form.date}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <Section title="01 · Student & Course Details">
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Field label="Student Name"><input value={form.studentName} onChange={(e) => set("studentName", e.target.value)} placeholder="Full name" className={inputCls} /></Field>
              <Field label="Branch / Centre Name"><input value={form.branch} onChange={(e) => set("branch", e.target.value)} placeholder="e.g. Kukatpally Centre" className={inputCls} /></Field>
              <Field label="Application No."><input value={form.applicationNo} onChange={(e) => set("applicationNo", e.target.value)} placeholder="APP-0000" className={inputCls} /></Field>
              <Field label="Requested Date"><input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} /></Field>
              <Field label="Student Contact No."><input value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="+91 …" className={inputCls} /></Field>
              <Field label="Total Fees (Incl. GST)"><input type="number" min={0} value={form.totalFees || ""} onChange={(e) => set("totalFees", Number(e.target.value))} placeholder="0" className={inputCls} /></Field>
              <Field label="Course / Programme"><input value={form.course} onChange={(e) => set("course", e.target.value)} placeholder="e.g. Full-Stack Development" className={inputCls} /></Field>
              <Field label="Course Duration"><input value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 6 months" className={inputCls} /></Field>
              <Field label="Starting Date"><input type="date" value={form.startingDate} onChange={(e) => set("startingDate", e.target.value)} className={inputCls} /></Field>
              <Field label="Net Payable After Discount">
                <div className={cn(inputCls, "flex items-center font-bold")}>{money(net)}</div>
              </Field>
            </div>
          </Section>

          <Section title="02 · Concession Request">
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Field label="Concession Type">
                <div className="flex flex-wrap gap-2">
                  {(["Percentage", "Fixed Amount", "Special Case"] as const).map((t) => (
                    <button key={t} onClick={() => set("type", t)}
                      className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                        form.type === t ? "bg-skill-accent text-primary-foreground shadow-glow" : "border bg-background text-muted-foreground hover:bg-accent")}>
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Requested Discount">
                <input type="number" min={0} value={form.discount || ""} onChange={(e) => set("discount", Number(e.target.value))} placeholder={form.type === "Percentage" ? "e.g. 10 (%)" : "e.g. 5000 (₹)"} className={inputCls} />
              </Field>
              <Field label="Amount Already Paid"><input type="number" min={0} value={form.amountPaid || ""} onChange={(e) => set("amountPaid", Number(e.target.value))} placeholder="0" className={inputCls} /></Field>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-foreground">Reason for Discount / Supporting Details</p>
              <textarea value={form.reason} onChange={(e) => set("reason", e.target.value)} rows={3} placeholder="Explain why the concession is being requested…" className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="mt-4 border-t pt-4">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Student Declaration:</span> I request consideration of the above concession and confirm that the information provided is true and complete.
              </p>
              <div className="mt-3 max-w-sm">
                <Field label="Student Signature (type full name)"><input value={form.studentSign} onChange={(e) => set("studentSign", e.target.value)} placeholder="Signature" className={inputCls} /></Field>
              </div>
            </div>
          </Section>

          <Section title="03 · Office Review & Approval">
            <div className="grid gap-3 sm:grid-cols-3">
              {APPROVERS.map((a) => (
                <div key={a.key} className="rounded-xl border border-dashed border-border bg-background/50 px-4 py-6 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-skill-accent">{a.title}</p>
                  <div className="h-10" />
                  <p className="text-xs text-muted-foreground">Sign from the saved list below</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[11px] italic text-muted-foreground">CONFIDENTIAL • For Internal Administrative Use Only</p>
          </Section>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={save} disabled={!canSave}
              className={cn("flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition",
                canSave ? "bg-primary-gradient text-primary-foreground shadow-glow hover:opacity-95" : "cursor-not-allowed bg-muted text-muted-foreground")}>
              <Save className="size-4" />Save Concession
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent">
              <Printer className="size-4" />Print Form
            </button>
            {!canSave && <span className="text-xs text-muted-foreground">Student name, course and reason are required.</span>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <p className="font-bold">Saved Concessions</p>
            <p className="text-xs text-muted-foreground">{records.length} record{records.length === 1 ? "" : "s"} · approval needs all three signatures</p>
          </div>
          <button onClick={() => setForm(emptyForm())} className="flex items-center gap-1.5 rounded-lg bg-primary-gradient px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-glow">
            <Plus className="size-3.5" />New
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-accent/40">
              <tr>
                {["No.", "Student", "Course", "Type", "Discount", "Net Payable", "Approvals", "Status", ""].map((l) => (
                  <th key={l} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const signed = [r.salesHead, r.manager, r.director].filter(Boolean).length;
                const approved = signed === 3;
                return (
                  <tr key={r.id} className="row-fx border-b last:border-0">
                    <td className="px-4 py-3 text-sm font-semibold">{r.id}</td>
                    <td className="px-4 py-3 text-sm">
                      <p className="font-medium">{r.studentName}</p>
                      <p className="text-xs text-muted-foreground">{r.branch || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{r.course}</td>
                    <td className="px-4 py-3 text-sm">{r.type}</td>
                    <td className="px-4 py-3 text-sm">{r.type === "Percentage" ? `${r.discount}%` : money(r.discount)}</td>
                    <td className="px-4 py-3 text-sm font-bold">{money(r.netPayable)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {APPROVERS.map((a) => (
                          <button key={a.key} onClick={() => sign(r.id, a.key)} title={`Sign as ${a.title}`}
                            className={cn("size-6 rounded-full border text-[10px] font-bold transition",
                              r[a.key] ? "border-success bg-success/10 text-success" : "border-border text-muted-foreground hover:border-skill-accent hover:text-skill-accent")}>
                            {a.short}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        approved ? "bg-success/10 text-success" : "bg-warning/15 text-warning")}>
                        {approved ? "Approved" : `Pending (${signed}/3)`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => loadForEdit(r)} className="rounded-lg border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-accent">Edit</button>
                    </td>
                  </tr>
                );
              })}
              {records.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">No concessions saved yet — fill the form above and click Save.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
