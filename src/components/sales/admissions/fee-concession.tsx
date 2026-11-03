import { useMemo, useState } from "react";
import { FileSignature, Plus, Printer, Save, CheckCircle2, GraduationCap } from "lucide-react";
import { useCloudState } from "@/lib/cloud-state";
import { cn } from "@/lib/utils";

type ConcessionType = "Percentage" | "Fixed Amount" | "Special Case";
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

const label = "text-xs font-semibold text-foreground";
const input = "mt-1 h-9 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";
const sectionTitle = "flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-skill-accent";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <p className={sectionTitle}>{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label: l, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className={label}>{l}</p>
      {children}
    </div>
  );
}

function emptyForm(): Omit<ConcessionRecord, "id" | "netPayable" | "salesHead" | "manager" | "director"> {
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

const APPROVERS = [
  { key: "salesHead", title: "SALES HEAD" },
  { key: "manager", title: "MANAGER" },
  { key: "director", title: "DIRECTOR & CEO" },
] as const;

function ApproverBox({ title, sig, onSign }: { title: string; sig: Signature | null; onSign: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-background/50 px-4 py-5 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-skill-accent">{title}</p>
      {sig ? (
        <div className="mt-2">
          <CheckCircle2 className="mx-auto size-6 text-success" />
          <p className="mt-1 text-sm font-semibold">{sig.name}</p>
          <p className="text-[11px] text-muted-foreground">Signed {sig.at}</p>
        </div>
      ) : (
        <>
          <div className="mt-2 h-12" />
          <button onClick={onSign} className="flex items-center gap-1.5 rounded-lg bg-skill-accent/10 px-3 py-1.5 text-xs font-semibold text-skill-accent hover:bg-skill-accent/20">
            <FileSignature className="size-3.5" />Signature
          </button>
        </>
      )}
    </div>
  );
}

export function FeeConcessionForm() {
  const [records, setRecords] = useCloudState<ConcessionRecord[]>("admission.fee-concessions", []);
  const [form, setForm] = useState(emptyForm);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const net = useMemo(() => computeNet(form.totalFees, form.type, form.discount), [form.totalFees, form.type, form.discount]);
  const nextId = () => `FC-${String(records.length + 1).padStart(4, "0")}`;

  const canSave = form.studentName.trim() && form.course.trim() && form.reason.trim();

  const save = () => {
    if (!canSave) return;
    setRecords((prev) => [...prev, {
      ...form, id: nextId(), totalFees: form.totalFees || 0, amountPaid: form.amountPaid || 0,
      discount: form.discount || 0, netPayable: net, salesHead: null, manager: null, director: null,
    }]);
    setForm(emptyForm());
  };

  const sign = (id: string, key: "salesHead" | "manager" | "director") =>
    setRecords((prev) => prev.map((r) => (r.id === id
      ? { ...r, [key]: { name: "Praneeth", at: nowStamp() } } : r)));

  const loadForEdit = (r: ConcessionRecord) => {
    setForm({ ...r });
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
              <p className="text-sm font-semibold">{nextId()}</p>
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
              <Field label="Student Name"><input value={form.studentName} onChange={(e) => set("studentName", e.target.value)} placeholder="Full name" className={input} /></Field>
              <Field label="Branch / Centre Name"><input value={form.branch} onChange={(e) => set("branch", e.target.value)} placeholder="e.g. Kukatpally Centre" className={input} /></Field>
              <Field label="Application No."><input value={form.applicationNo} onChange={(e) => set("applicationNo", e.target.value)} placeholder="APP-0000" className={input} /></Field>
              <Field label="Requested Date"><input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={input} /></Field>
              <Field label="Student Contact No."><input value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="+91 …" className={input} /></Field>
              <Field label="Total Fees (Incl. GST)"><input type="number" min={0} value={form.totalFees || ""} onChange={(e) => set("totalFees", Number(e.target.value))} placeholder="0" className={input} /></Field>
              <Field label="Course / Programme"><input value={form.course} onChange={(e) => set("course", e.target.value)} placeholder="e.g. Full-Stack Development" className={input} /></Field>
              <Field label="Requested Discount"><input type="number" min={0} value={form.discount || ""} onChange={(e) => set("discount", Number(e.target.value))} placeholder="0" className={input} /></Field>
              <Field label="Course Duration"><input value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 6 months" className={input} /></Field>
              <Field label="Amount Already Paid"><input type="number" min={0} value={form.amountPaid || ""} onChange={(e) => set("amountPaid", Number(e.target.value))} placeholder="0" className={input} /></Field>
              <Field label="Starting Date"><input type="date" value={form.startingDate} onChange={(e) => set("startingDate", e.target.value)} className={input} /></Field>
              <Field label="Net Payable After Discount">
                <div className={cn(input, "flex items-center font-bold")}>{money(net)}</div>
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
                        form.type === t ? "bg-skill-accent text-white shadow-glow" : "border bg-background text-muted-foreground hover:bg-accent")}>
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Requested Discount Value">
                <input type="number" min={0} value={form.discount || ""} onChange={(e) => set("discount", Number(e.target.value))} placeholder={form.type === "Percentage" ? "e.g. 10 (%)" : "e.g. 5000 (₹)"} className={input} />
              </Field>
            </div>
            <div className="mt-3">
              <p className={label}>Reason for Discount / Supporting Details</p>
              <textarea value={form.reason} onChange={(e) => set("reason", e.target.value)} rows={3} placeholder="Explain why the concession is being requested…" className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="mt-4 grid gap-x-6 gap-y-3 border-t pt-4 sm:grid-cols-2">
              <p className="text-xs text-muted-foreground sm:col-span-2">
                <span className="font-semibold text-foreground">Student Declaration:</span> I request consideration of the above concession and confirm that the information provided is true and complete.
              </p>
              <Field label="Student Signature (type full name)"><input value={form.studentSign} onChange={(e) => set("studentSign", e.target.value)} placeholder="Signature" className={input} /></Field>
            </div>
          </Section>

          <Section title="03 · Office Review & Approval">
            <div className="grid gap-3 sm:grid-cols-3">
              {APPROVERS.map((a) => (
                <ApproverBox key={a.key} title={a.title} sig={null} onSign={() => {}} />
              ))}
            </div>
            <p className="mt-4 text-center text-[11px] italic text-muted-foreground">CONFIDENTIAL • For Internal Administrative Use Only</p>
          </Section>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={save} disabled={!canSave}
              className={cn("flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold shadow-glow transition",
                canSave ? "bg-primary-gradient text-primary-foreground hover:opacity-95" : "cursor-not-allowed bg-muted text-muted-foreground shadow-none")}>
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
                    <td className="px-4 py-3 text-sm">{r.discount}{r.type === "Percentage" ? "%" : ""} · {money(r.discount)}</td>
                    <td className="px-4 py-3 text-sm font-bold">{money(r.netPayable)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-1">
                        {APPROVERS.map((a) => (
                          <button key={a.key} onClick={() => sign(r.id, a.key)} title={`Sign as ${a.title}`}
                            className={cn("size-6 rounded-full border text-[10px] font-bold transition",
                              r[a.key] ? "border-success bg-success/10 text-success" : "border-border text-muted-foreground hover:border-skill-accent hover:text-skill-accent")}>
                            {a.key === "salesHead" ? "SH" : a.key === "manager" ? "M" : "CEO"}
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
