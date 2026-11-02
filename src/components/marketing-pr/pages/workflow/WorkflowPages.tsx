import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { Card, CardBody, CardHeader, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { Badge, type BadgeVariant } from '@/components/marketing-pr/components/ui/Badge';
import { Table, type Column } from '@/components/marketing-pr/components/ui/Table';
import { Drawer, Modal } from '@/components/marketing-pr/components/ui/Drawer';
import { Button, FilterDropdown, InfoRow, PageHeader, SectionTitle } from '@/components/marketing-pr/components/ui/Common';
import { BarChart } from '@/components/marketing-pr/components/charts/Charts';
import type {
  DigitalActivity,
  Role,
  WorkflowActivityStatus,
  WorkflowCampaign,
  WorkflowContent,
  WorkflowContentStatus,
  WorkflowEvent,
} from '@/components/marketing-pr/types';
import type { WorkflowState } from '@/components/marketing-pr/data/workflowData';
import {
  Activity, BarChart3, CalendarDays, CheckCircle2, ClipboardCheck, FileText,
  Globe, MessageSquare, MousePointerClick, Plus, Send, Target,
  TrendingUp, Users, XCircle,
} from 'lucide-react';

export interface WorkflowPageProps {
  state: WorkflowState;
  setState: Dispatch<SetStateAction<WorkflowState>>;
  onNotify?: (notification: { title: string; message: string; role: Role }) => void;
}

const HEAD = 'Marketing Head / PRO';
const CONTENT = 'Content / Brand Team';
const DIGITAL = 'Digital Marketing Executive';
const EVENTS = 'Events & Outreach Coordinator';

function nowStamp() {
  const date = new Date();
  return `${date.toISOString().slice(0, 10)} ${date.toTimeString().slice(0, 5)}`;
}

function workflowVariant(status: string): BadgeVariant {
  if (['Approved', 'Completed', 'Active', 'Used'].includes(status)) return 'green';
  if (['Under Review', 'Submitted', 'In Progress', 'Planning', 'Pending Review'].includes(status)) return 'blue';
  if (['Changes Requested', 'Rejected'].includes(status)) return 'red';
  if (['Draft', 'Not Started'].includes(status)) return 'amber';
  return 'slate';
}

function updateState(
  setState: WorkflowPageProps['setState'],
  onNotify: WorkflowPageProps['onNotify'],
  update: { message: string; actor: string; role: Role; campaignId?: string },
  notification?: { title: string; message: string; role: Role },
) {
  setState((previous) => ({
    ...previous,
    updates: [
      { id: `WF-UPD-${Date.now()}`, ...update, date: nowStamp() },
      ...previous.updates,
    ],
  }));
  if (notification) onNotify?.(notification);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</span>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, type = 'text', placeholder }: { value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />;
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <textarea value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />;
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>;
}

export function WorkflowDashboard({ state }: WorkflowPageProps) {
  const totalTasks = state.campaigns.length + state.content.length + state.digital.length + state.events.length;
  const openTasks = state.content.filter((item) => ['Draft', 'Submitted', 'Not Started'].includes(item.status) || item.status === 'Draft').length
    + state.digital.filter((activity) => ['Not Started', 'In Progress'].includes(activity.status)).length
    + state.events.filter((event) => ['Not Started', 'In Progress'].includes(event.status)).length;
  const inProgressTasks = state.content.filter((item) => item.status === 'Under Review').length
    + state.digital.filter((activity) => activity.status === 'In Progress').length
    + state.events.filter((event) => event.status === 'In Progress').length;
  const pendingReviewTasks = state.content.filter((item) => ['Submitted', 'Under Review'].includes(item.status)).length
    + state.digital.filter((activity) => activity.status === 'Pending Review').length
    + state.events.filter((event) => event.status === 'Pending Review').length;
  const completedTasks = state.content.filter((item) => ['Approved', 'Used'].includes(item.status)).length
    + state.digital.filter((activity) => activity.status === 'Completed').length
    + state.events.filter((event) => event.status === 'Completed').length;
  return (
    <div>
      <PageHeader title="Marketing Head / PRO Dashboard" description="Central coordination for campaign tasks, approvals, digital performance, events, and outreach execution." />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
        <StatCard label="Total Tasks" value={totalTasks} icon={<Target size={20} />} accent="blue" />
        <StatCard label="Open Tasks" value={openTasks} icon={<ClipboardCheck size={20} />} accent="amber" />
        <StatCard label="In Progress Tasks" value={inProgressTasks} icon={<Activity size={20} />} accent="indigo" />
        <StatCard label="Pending Review Tasks" value={pendingReviewTasks} icon={<ClipboardCheck size={20} />} accent="amber" />
        <StatCard label="Completed Tasks" value={completedTasks} icon={<CheckCircle2 size={20} />} accent="green" />
      </div>

      <div className="grid lg:grid-cols-1 gap-3 mb-3">
        <Card>
          <CardHeader title="Recent Updates" subtitle="Internal workflow activity across all functions" icon={<Activity size={18} />} />
          <CardBody>
            <div className="space-y-3">
              {state.updates.slice(0, 5).map((update) => (
                <div key={update.id} className="flex gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700">{update.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{update.actor} · {update.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Team-wise Task Summary" subtitle="Assigned work and progress across the primary workflow teams" icon={<Users size={18} />} />
        <div className="grid md:grid-cols-3 gap-3 p-5">
          <div className="border border-slate-200 rounded-lg p-4 bg-violet-50/50">
            <h3 className="font-semibold text-slate-800">Content Team</h3>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="bg-white rounded-lg p-2"><p className="text-lg font-bold text-violet-700">{state.content.length}</p><p className="text-[11px] text-violet-600">Assigned</p></div>
              <div className="bg-white rounded-lg p-2"><p className="text-lg font-bold text-violet-700">{state.content.filter((item) => ['Approved', 'Used'].includes(item.status)).length}</p><p className="text-[11px] text-violet-600">Completed</p></div>
              <div className="bg-white rounded-lg p-2"><p className="text-lg font-bold text-violet-700">{state.content.filter((item) => ['Submitted', 'Under Review', 'Changes Requested'].includes(item.status)).length}</p><p className="text-[11px] text-violet-600">Pending</p></div>
            </div>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 bg-cyan-50/60">
            <h3 className="font-semibold text-slate-800">Digital Marketing</h3>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="bg-white rounded-lg p-2"><p className="text-lg font-bold text-cyan-700">{state.digital.length}</p><p className="text-[11px] text-cyan-600">Assigned</p></div>
              <div className="bg-white rounded-lg p-2"><p className="text-lg font-bold text-cyan-700">{state.digital.filter((item) => item.status === 'Completed').length}</p><p className="text-[11px] text-cyan-600">Completed</p></div>
              <div className="bg-white rounded-lg p-2"><p className="text-lg font-bold text-cyan-700">{state.digital.filter((item) => ['In Progress', 'Pending Review'].includes(item.status)).length}</p><p className="text-[11px] text-cyan-600">Pending</p></div>
            </div>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 bg-amber-50/60">
            <h3 className="font-semibold text-slate-800">Events Team</h3>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="bg-white rounded-lg p-2"><p className="text-lg font-bold text-amber-700">{state.events.length}</p><p className="text-[11px] text-amber-600">Assigned</p></div>
              <div className="bg-white rounded-lg p-2"><p className="text-lg font-bold text-amber-700">{state.events.filter((item) => item.status === 'Completed').length}</p><p className="text-[11px] text-amber-600">Completed</p></div>
              <div className="bg-white rounded-lg p-2"><p className="text-lg font-bold text-amber-700">{state.events.filter((item) => ['In Progress', 'Pending Review'].includes(item.status)).length}</p><p className="text-[11px] text-amber-600">Pending</p></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function WorkflowAnalyticsPage({ state }: WorkflowPageProps) {
  const contentCreated = state.content.length;
  const contentApproved = state.content.filter((item) => ['Approved', 'Used'].includes(item.status)).length;
  const pendingContent = state.content.filter((item) => ['Submitted', 'Under Review'].includes(item.status)).length;
  const views = state.digital.reduce((sum, activity) => sum + activity.performance.views, 0);
  const reach = state.digital.reduce((sum, activity) => sum + activity.performance.reach, 0);
  const clicks = state.digital.reduce((sum, activity) => sum + activity.performance.clicks, 0);
  const digitalEnquiries = state.digital.reduce((sum, activity) => sum + activity.performance.enquiries, 0);
  const registrations = state.events.reduce((sum, event) => sum + event.registrationCount, 0);
  const attendance = state.events.reduce((sum, event) => sum + event.attendanceCount, 0);
  const eventEnquiries = state.events.reduce((sum, event) => sum + event.enquiries, 0);

  return (
    <div>
      <PageHeader title="Analytics & Reports" description="Central reporting from the campaign, content, digital, and event records maintained in this system." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Content Created" value={contentCreated} icon={<FileText size={20} />} accent="blue" />
        <StatCard label="Content Approved" value={contentApproved} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="Pending Content" value={pendingContent} icon={<ClipboardCheck size={20} />} accent="amber" />
        <StatCard label="Active Campaigns" value={state.campaigns.filter((campaign) => ['Active', 'In Progress'].includes(campaign.status)).length} icon={<Target size={20} />} accent="indigo" />
      </div>
      <div className="grid lg:grid-cols-2 gap-3 mb-3">
        <Card><CardHeader title="Digital Marketing Report" subtitle="Manually recorded performance" icon={<Globe size={18} />} /><CardBody><div className="grid grid-cols-2 gap-2"><Metric label="Views" value={views.toLocaleString()} /><Metric label="Reach" value={reach.toLocaleString()} /><Metric label="Clicks" value={clicks.toLocaleString()} /><Metric label="Enquiries" value={digitalEnquiries.toLocaleString()} /></div></CardBody></Card>
        <Card><CardHeader title="Event & Outreach Report" subtitle="Registrations and results" icon={<CalendarDays size={18} />} /><CardBody><div className="grid grid-cols-2 gap-2"><Metric label="Events" value={state.events.length.toLocaleString()} /><Metric label="Registrations" value={registrations.toLocaleString()} /><Metric label="Attendance" value={attendance.toLocaleString()} /><Metric label="Enquiries" value={eventEnquiries.toLocaleString()} /></div></CardBody></Card>
      </div>
      <Card><CardHeader title="Campaign Report" subtitle="Combined digital reach and event registrations" icon={<BarChart3 size={18} />} /><CardBody><BarChart data={state.campaigns.map((campaign) => ({ label: campaign.name, value: state.digital.filter((activity) => activity.campaignId === campaign.id).reduce((sum, activity) => sum + activity.performance.reach, 0) + state.events.filter((event) => event.campaignId === campaign.id).reduce((sum, event) => sum + event.registrationCount, 0), color: 'bg-cyan-500' }))} /></CardBody></Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {['Monthly Marketing Report', 'Campaign Report', 'Digital Marketing Report', 'Event & Outreach Report'].map((report) => <Card key={report} className="p-4"><div className="flex items-center gap-3"><BarChart3 size={18} className="text-blue-500" /><div><p className="text-sm font-semibold text-slate-700">{report}</p><p className="text-xs text-slate-400 mt-0.5">Live from current records</p></div></div></Card>)}
      </div>
    </div>
  );
}

export function WorkflowCampaigns({ state, setState, onNotify }: WorkflowPageProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<WorkflowCampaign | null>(null);
  const [form, setForm] = useState({ name: '', objective: '', targetAudience: '', startDate: '', endDate: '', status: 'Planning' as WorkflowCampaign['status'] });

  const createCampaign = () => {
    if (!form.name.trim() || !form.startDate || !form.endDate) return;
    const stamp = nowStamp();
    const campaign: WorkflowCampaign = { id: `WF-CMP-${Date.now()}`, ...form, createdBy: HEAD, updatedBy: HEAD, updatedAt: stamp };
    setState((previous) => ({ ...previous, campaigns: [campaign, ...previous.campaigns] }));
    updateState(setState, onNotify, { message: `Campaign created: ${campaign.name}.`, actor: HEAD, role: 'marketing-head', campaignId: campaign.id });
    setForm({ name: '', objective: '', targetAudience: '', startDate: '', endDate: '', status: 'Planning' });
    setCreateOpen(false);
  };

  const approveCampaign = (campaign: WorkflowCampaign) => {
    const stamp = nowStamp();
    setState((previous) => ({
      ...previous,
      campaigns: previous.campaigns.map((item) => item.id === campaign.id ? { ...item, status: 'Completed', updatedBy: HEAD, updatedAt: stamp } : item),
    }));
    updateState(setState, onNotify, { message: `Campaign approved: ${campaign.name}.`, actor: HEAD, role: 'marketing-head', campaignId: campaign.id }, { title: 'Campaign approved', message: `${campaign.name} is now marked as completed.`, role: 'marketing-head' });
    setSelected(null);
  };

  const rejectCampaign = (campaign: WorkflowCampaign) => {
    const stamp = nowStamp();
    setState((previous) => ({
      ...previous,
      campaigns: previous.campaigns.map((item) => item.id === campaign.id ? { ...item, status: 'Planning', updatedBy: HEAD, updatedAt: stamp } : item),
    }));
    updateState(setState, onNotify, { message: `Campaign rejected: ${campaign.name}.`, actor: HEAD, role: 'marketing-head', campaignId: campaign.id }, { title: 'Campaign rejected', message: `${campaign.name} has been sent back for review.`, role: 'marketing-head' });
    setSelected(null);
  };

  const requestChangesCampaign = (campaign: WorkflowCampaign) => {
    const stamp = nowStamp();
    setState((previous) => ({
      ...previous,
      campaigns: previous.campaigns.map((item) => item.id === campaign.id ? { ...item, status: 'In Progress', updatedBy: HEAD, updatedAt: stamp } : item),
    }));
    updateState(setState, onNotify, { message: `Changes requested for campaign: ${campaign.name}.`, actor: HEAD, role: 'marketing-head', campaignId: campaign.id }, { title: 'Changes requested', message: `${campaign.name} is being revised by the team.`, role: 'marketing-head' });
    setSelected(null);
  };

  const columns: Column<WorkflowCampaign>[] = [
    { key: 'name', header: 'Campaign', render: (row) => <span className="font-medium text-slate-700">{row.name}</span> },
    { key: 'audience', header: 'Target Audience', render: (row) => <span className="text-xs text-slate-500">{row.targetAudience}</span> },
    { key: 'dates', header: 'Dates', render: (row) => <span className="text-xs text-slate-500">{row.startDate} - {row.endDate}</span> },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={workflowVariant(row.status)}>{row.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Campaign Workspace" description="Create central campaigns and review the connected content, digital activities, and events." action={<Button icon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>Create Campaign</Button>} />
      <Card><CardHeader title="Central Campaigns" subtitle="Every function connects through these campaign records" icon={<Target size={18} />} /><Table columns={columns} data={state.campaigns} onRowClick={setSelected} /></Card>
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Campaign Workspace"
        subtitle={selected?.name}
        footer={selected ? (
          <div className="flex justify-end gap-2 flex-wrap">
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            <Button onClick={() => approveCampaign(selected)}>Approve</Button>
            <Button variant="secondary" onClick={() => rejectCampaign(selected)}>Reject</Button>
            <Button variant="secondary" onClick={() => requestChangesCampaign(selected)}>Make Changes</Button>
          </div>
        ) : undefined}
      >
        {selected && <CampaignDetail state={state} campaign={selected} />}
      </Drawer>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Campaign" subtitle="Set the shared brief for all three functions" footer={<div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={createCampaign} disabled={!form.name.trim() || !form.startDate || !form.endDate}>Create Campaign</Button></div>}>
        <div className="space-y-3">
          <Field label="Campaign Name"><TextInput value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="BCA Admission 2027" /></Field>
          <Field label="Objective"><TextArea value={form.objective} onChange={(value) => setForm({ ...form, objective: value })} placeholder="What should this campaign achieve?" /></Field>
          <Field label="Target Audience"><TextInput value={form.targetAudience} onChange={(value) => setForm({ ...form, targetAudience: value })} placeholder="Students and parents" /></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="Start Date"><TextInput type="date" value={form.startDate} onChange={(value) => setForm({ ...form, startDate: value })} /></Field><Field label="End Date"><TextInput type="date" value={form.endDate} onChange={(value) => setForm({ ...form, endDate: value })} /></Field></div>
          <Field label="Status"><SelectInput value={form.status} onChange={(value) => setForm({ ...form, status: value as WorkflowCampaign['status'] })} options={['Draft', 'Planning', 'In Progress', 'Active', 'Completed']} /></Field>
        </div>
      </Modal>
    </div>
  );
}

function CampaignDetail({ state, campaign }: { state: WorkflowState; campaign: WorkflowCampaign }) {
  const content = state.content.filter((item) => item.campaignId === campaign.id);
  const digital = state.digital.filter((item) => item.campaignId === campaign.id);
  const events = state.events.filter((item) => item.campaignId === campaign.id);
  const updates = state.updates.filter((item) => item.campaignId === campaign.id);
  return <div className="space-y-4"><div className="flex items-center gap-2"><Badge variant={workflowVariant(campaign.status)}>{campaign.status}</Badge><span className="text-xs text-slate-400">Updated by {campaign.updatedBy} on {campaign.updatedAt}</span></div><InfoRow label="Objective" value={campaign.objective} /><InfoRow label="Target Audience" value={campaign.targetAudience} /><SectionTitle title="Connected Workflow" /><div className="space-y-2"><WorkflowLine icon={<FileText size={15} />} label="Content / Brand" value={`${content.length} material${content.length === 1 ? '' : 's'} · ${content.filter((item) => item.status === 'Approved' || item.status === 'Used').length} approved`} /><WorkflowLine icon={<Globe size={15} />} label="Digital Marketing" value={`${digital.length} activit${digital.length === 1 ? 'y' : 'ies'} · ${digital.reduce((sum, item) => sum + item.performance.enquiries, 0)} enquiries`} /><WorkflowLine icon={<CalendarDays size={15} />} label="Events & Outreach" value={`${events.length} event${events.length === 1 ? '' : 's'} · ${events.reduce((sum, item) => sum + item.registrationCount, 0)} registrations`} /></div><SectionTitle title="Results" /><div className="grid grid-cols-2 gap-2"><Metric label="Reach" value={digital.reduce((sum, item) => sum + item.performance.reach, 0).toLocaleString()} /><Metric label="Clicks" value={digital.reduce((sum, item) => sum + item.performance.clicks, 0).toLocaleString()} /><Metric label="Attendance" value={events.reduce((sum, item) => sum + item.attendanceCount, 0).toLocaleString()} /><Metric label="Enquiries" value={(digital.reduce((sum, item) => sum + item.performance.enquiries, 0) + events.reduce((sum, item) => sum + item.enquiries, 0)).toLocaleString()} /></div><SectionTitle title="Activity Timeline" /><div className="space-y-2">{updates.map((update) => <div key={update.id} className="border-l-2 border-blue-200 pl-3"><p className="text-sm text-slate-700">{update.message}</p><p className="text-xs text-slate-400">{update.actor} · {update.date}</p></div>)}</div></div>;
}

function WorkflowLine({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"><span className="text-slate-500">{icon}</span><div><p className="text-xs font-semibold text-slate-700">{label}</p><p className="text-xs text-slate-500">{value}</p></div></div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="p-3 bg-slate-50 rounded-lg"><p className="text-xs text-slate-400">{label}</p><p className="text-lg font-bold text-slate-800">{value}</p></div>; }

export function WorkflowContentPage({ state, setState, onNotify, role }: WorkflowPageProps & { role: 'content' | 'marketing-head' }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<WorkflowContent | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState({ campaignId: state.campaigns[0]?.id || '', title: '', type: 'Brochure' as WorkflowContent['type'], description: '' });
  const isHead = role === 'marketing-head';
  const visibleItems = state.content.filter((item) => statusFilter === 'all' || item.status === statusFilter);

  const createContent = () => {
    if (!form.title.trim() || !form.campaignId) return;
    const stamp = nowStamp();
    const item: WorkflowContent = { id: `WF-CON-${Date.now()}`, ...form, status: 'Draft', createdBy: CONTENT, updatedBy: CONTENT, updatedAt: stamp };
    setState((previous) => ({ ...previous, content: [item, ...previous.content] }));
    setCreateOpen(false);
    setForm({ ...form, title: '', description: '' });
  };

  const changeStatus = (item: WorkflowContent, status: WorkflowContentStatus) => {
    const actor = isHead ? HEAD : CONTENT;
    setState((previous) => ({ ...previous, content: previous.content.map((content) => content.id === item.id ? { ...content, status, updatedBy: actor, updatedAt: nowStamp() } : content) }));
    const message = status === 'Submitted' ? 'New content submitted for review.' : `Content ${status.toLowerCase()}: ${item.title}.`;
    updateState(setState, onNotify, { message, actor, role: isHead ? 'marketing-head' : 'content', campaignId: item.campaignId }, status === 'Submitted' ? { title: 'New content submitted for review', message: item.title, role: 'marketing-head' } : status === 'Approved' ? { title: 'Content approved', message: `${item.title} is now available to digital and events teams.`, role: 'marketing-head' } : undefined);
    setSelected(null);
  };

  const columns: Column<WorkflowContent>[] = [
    { key: 'title', header: 'Material', render: (row) => <span className="font-medium text-slate-700">{row.title}</span> },
    { key: 'campaign', header: 'Campaign', render: (row) => <span className="text-xs text-slate-500">{state.campaigns.find((campaign) => campaign.id === row.campaignId)?.name || 'Unassigned'}</span> },
    { key: 'type', header: 'Type', render: (row) => <Badge variant="purple">{row.type}</Badge> },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={workflowVariant(row.status)}>{row.status}</Badge> },
    { key: 'updated', header: 'Updated', render: (row) => <span className="text-xs text-slate-400">{row.updatedBy}</span> },
  ];

  return <div><PageHeader title={isHead ? 'Content Review & Approval' : 'Content / Brand Workspace'} description={isHead ? 'Review submitted materials. Only the Marketing Head / PRO can approve or request changes.' : 'Create materials, associate them with campaigns, and submit them for central review.'} action={!isHead ? <Button icon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>Create Material</Button> : undefined} /><div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3"><StatCard label="Total Materials" value={state.content.length} icon={<FileText size={20} />} accent="blue" /><StatCard label="Pending Review" value={state.content.filter((item) => ['Submitted', 'Under Review'].includes(item.status)).length} icon={<ClipboardCheck size={20} />} accent="amber" /><StatCard label="Approved" value={state.content.filter((item) => ['Approved', 'Used'].includes(item.status)).length} icon={<CheckCircle2 size={20} />} accent="green" /><StatCard label="Changes Requested" value={state.content.filter((item) => item.status === 'Changes Requested').length} icon={<XCircle size={20} />} accent="red" /></div><Card><CardHeader title="Campaign Materials" subtitle="Approval is required before other roles can use materials" icon={<FileText size={18} />} /><div className="px-5 py-3 border-b border-slate-100"><FilterDropdown label="Status" value={statusFilter} options={['Draft', 'Submitted', 'Under Review', 'Changes Requested', 'Approved', 'Used']} onChange={setStatusFilter} /></div><Table columns={columns} data={visibleItems} onRowClick={setSelected} /></Card><Drawer open={!!selected} onClose={() => setSelected(null)} title="Material Review" subtitle={selected?.title} footer={selected && <div className="flex justify-end gap-2 flex-wrap"><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>{!isHead && selected.status === 'Draft' && <Button icon={<Send size={15} />} onClick={() => changeStatus(selected, 'Submitted')}>Submit for Review</Button>}{!isHead && selected.status === 'Changes Requested' && <Button icon={<Send size={15} />} onClick={() => changeStatus(selected, 'Submitted')}>Resubmit</Button>}{isHead && ['Submitted', 'Under Review'].includes(selected.status) && <><Button variant="danger" onClick={() => changeStatus(selected, 'Changes Requested')}>Request Changes</Button><Button variant="success" onClick={() => changeStatus(selected, 'Approved')}>Approve</Button></>}</div>}>{selected && <div className="space-y-1"><Badge variant={workflowVariant(selected.status)}>{selected.status}</Badge><InfoRow label="Campaign" value={state.campaigns.find((campaign) => campaign.id === selected.campaignId)?.name || 'Unassigned'} /><InfoRow label="Created By" value={selected.createdBy} /><InfoRow label="Updated By" value={`${selected.updatedBy} on ${selected.updatedAt}`} /><div className="pt-3"><p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Description</p><p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p></div>{selected.status === 'Approved' && <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">Approved materials are available to Digital Marketing and Events & Outreach.</div>}</div>}</Drawer><Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Marketing Material" subtitle="New content starts as Draft" footer={<div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={createContent} disabled={!form.title.trim()}>Create Draft</Button></div>}><div className="space-y-3"><Field label="Campaign"><SelectInput value={form.campaignId} onChange={(value) => setForm({ ...form, campaignId: value })} options={state.campaigns.map((campaign) => campaign.id)} /></Field><p className="text-xs text-slate-500">{state.campaigns.find((campaign) => campaign.id === form.campaignId)?.name}</p><Field label="Title"><TextInput value={form.title} onChange={(value) => setForm({ ...form, title: value })} placeholder="BCA Admission Poster" /></Field><Field label="Type"><SelectInput value={form.type} onChange={(value) => setForm({ ...form, type: value as WorkflowContent['type'] })} options={['Prospectus', 'Brochure', 'Newsletter', 'Poster', 'Announcement', 'Promotional Material']} /></Field><Field label="Description"><TextArea value={form.description} onChange={(value) => setForm({ ...form, description: value })} placeholder="Describe the material and intended use" /></Field></div></Modal></div>;
}

function ApprovedContent({ state, campaignId, selectedIds, onToggle }: { state: WorkflowState; campaignId: string; selectedIds: string[]; onToggle: (id: string) => void }) {
  const items = state.content.filter((item) => item.campaignId === campaignId && ['Approved', 'Used'].includes(item.status));
  return <div className="space-y-2">{items.length === 0 && <p className="text-xs text-slate-500">No approved materials are available for this campaign yet.</p>}{items.map((item) => <label key={item.id} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg text-sm text-slate-700"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => onToggle(item.id)} />{item.title}<Badge variant="green" className="ml-auto">Approved</Badge></label>)}</div>;
}

export function WorkflowDigitalPage({ state, setState, onNotify }: WorkflowPageProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<DigitalActivity | null>(null);
  const [form, setForm] = useState({ campaignId: state.campaigns[0]?.id || '', name: '', platform: 'Social Media' as DigitalActivity['platform'], contentIds: [] as string[] });
  const [performance, setPerformance] = useState({ views: '', reach: '', likes: '', comments: '', shares: '', clicks: '', enquiries: '', date: new Date().toISOString().slice(0, 10) });
  const approved = (campaignId: string) => state.content.filter((item) => item.campaignId === campaignId && ['Approved', 'Used'].includes(item.status));
  const toggleContent = (id: string) => setForm((previous) => ({ ...previous, contentIds: previous.contentIds.includes(id) ? previous.contentIds.filter((contentId) => contentId !== id) : [...previous.contentIds, id] }));
  const createActivity = () => { if (!form.name.trim()) return; const activity: DigitalActivity = { id: `WF-DIG-${Date.now()}`, campaignId: form.campaignId, name: form.name, platform: form.platform, contentIds: form.contentIds, status: 'Not Started', updatedBy: DIGITAL, updatedAt: nowStamp(), performance: { views: 0, reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0, enquiries: 0, date: new Date().toISOString().slice(0, 10) } }; setState((previous) => ({ ...previous, digital: [activity, ...previous.digital] })); setCreateOpen(false); setForm({ ...form, name: '', contentIds: [] }); };
  const savePerformance = () => { if (!selected) return; const nextPerformance = Object.fromEntries(Object.entries(performance).map(([key, value]) => [key, ['date'].includes(key) ? value : Number(value) || 0])) as DigitalActivity['performance']; setState((previous) => ({ ...previous, digital: previous.digital.map((activity) => activity.id === selected.id ? { ...activity, performance: nextPerformance, status: 'Pending Review', updatedBy: DIGITAL, updatedAt: nowStamp() } : activity) })); updateState(setState, onNotify, { message: 'Digital marketing performance updated.', actor: DIGITAL, role: 'digital', campaignId: selected.campaignId }, { title: 'Digital marketing performance updated', message: selected.name, role: 'marketing-head' }); setSelected(null); };
  const openPerformance = (activity: DigitalActivity) => { setSelected(activity); setPerformance({ views: String(activity.performance.views), reach: String(activity.performance.reach), likes: String(activity.performance.likes), comments: String(activity.performance.comments), shares: String(activity.performance.shares), clicks: String(activity.performance.clicks), enquiries: String(activity.performance.enquiries), date: activity.performance.date }); };
  const columns: Column<DigitalActivity>[] = [{ key: 'name', header: 'Activity', render: (row) => <span className="font-medium text-slate-700">{row.name}</span> }, { key: 'campaign', header: 'Campaign', render: (row) => <span className="text-xs text-slate-500">{state.campaigns.find((campaign) => campaign.id === row.campaignId)?.name}</span> }, { key: 'platform', header: 'Platform', render: (row) => <Badge variant="blue">{row.platform}</Badge> }, { key: 'reach', header: 'Reach', render: (row) => <span>{row.performance.reach.toLocaleString()}</span> }, { key: 'enquiries', header: 'Enquiries', render: (row) => <span>{row.performance.enquiries}</span> }, { key: 'status', header: 'Status', render: (row) => <Badge variant={workflowVariant(row.status)}>{row.status}</Badge> }];
  return <div><PageHeader title="Digital Marketing Workspace" description="Use approved materials only, manage assigned campaign activities, and manually submit performance results." action={<Button icon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>Create Digital Activity</Button>} /><div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3"><StatCard label="Activities" value={state.digital.length} icon={<Globe size={20} />} accent="blue" /><StatCard label="Reach" value={state.digital.reduce((sum, activity) => sum + activity.performance.reach, 0).toLocaleString()} icon={<Users size={20} />} accent="blue" /><StatCard label="Clicks" value={state.digital.reduce((sum, activity) => sum + activity.performance.clicks, 0).toLocaleString()} icon={<MousePointerClick size={20} />} accent="indigo" /><StatCard label="Enquiries" value={state.digital.reduce((sum, activity) => sum + activity.performance.enquiries, 0)} icon={<TrendingUp size={20} />} accent="green" /></div><Card><CardHeader title="Assigned Digital Activities" subtitle="Double-click a row to enter manual performance values" icon={<Globe size={18} />} /><Table columns={columns} data={state.digital} onRowClick={openPerformance} /></Card><Drawer open={!!selected} onClose={() => setSelected(null)} title="Update Digital Performance" subtitle={selected?.name} footer={<div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setSelected(null)}>Cancel</Button><Button icon={<Send size={15} />} onClick={savePerformance}>Submit Update</Button></div>}>{selected && <div className="space-y-3"><InfoRow label="Campaign" value={state.campaigns.find((campaign) => campaign.id === selected.campaignId)?.name || ''} /><InfoRow label="Approved Materials" value={selected.contentIds.map((id) => state.content.find((item) => item.id === id)?.title).filter(Boolean).join(', ') || 'None selected'} /><div className="grid grid-cols-2 gap-3">{(['views', 'reach', 'likes', 'comments', 'shares', 'clicks', 'enquiries'] as const).map((key) => <Field key={key} label={key}><TextInput type="number" value={performance[key]} onChange={(value) => setPerformance({ ...performance, [key]: value })} /></Field>)}</div><Field label="Campaign Date"><TextInput type="date" value={performance.date} onChange={(value) => setPerformance({ ...performance, date: value })} /></Field></div>}</Drawer><Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Digital Activity" subtitle="Only approved content can be attached" footer={<div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={createActivity} disabled={!form.name.trim()}>Create Activity</Button></div>}><div className="space-y-3"><Field label="Campaign"><SelectInput value={form.campaignId} onChange={(value) => setForm({ ...form, campaignId: value, contentIds: [] })} options={state.campaigns.map((campaign) => campaign.id)} /></Field><p className="text-xs text-slate-500">{state.campaigns.find((campaign) => campaign.id === form.campaignId)?.name}</p><Field label="Activity Name"><TextInput value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="BCA website promotion" /></Field><Field label="Platform"><SelectInput value={form.platform} onChange={(value) => setForm({ ...form, platform: value as DigitalActivity['platform'] })} options={['Website', 'Social Media', 'SEO', 'Digital Campaign']} /></Field><Field label="Approved Content"><ApprovedContent state={state} campaignId={form.campaignId} selectedIds={form.contentIds} onToggle={toggleContent} /></Field></div></Modal></div>;
}

export function WorkflowEventsPage({ state, setState, onNotify }: WorkflowPageProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<WorkflowEvent | null>(null);
  const [form, setForm] = useState({ campaignId: state.campaigns[0]?.id || '', name: '', type: 'Open Day' as WorkflowEvent['type'], date: '', time: '', location: '', targetAudience: '', description: '', organizer: EVENTS, expectedParticipants: '' });
  const [results, setResults] = useState({ registrationCount: '', attendanceCount: '', enquiries: '', feedback: '' });
  const approved = (campaignId: string) => state.content.filter((item) => item.campaignId === campaignId && ['Approved', 'Used'].includes(item.status));
  const createEvent = () => { if (!form.name.trim() || !form.date) return; const event: WorkflowEvent = { id: `WF-EVT-${Date.now()}`, ...form, expectedParticipants: Number(form.expectedParticipants) || 0, registrationCount: 0, attendanceCount: 0, enquiries: 0, feedback: '', status: 'Not Started', contentIds: approved(form.campaignId).map((item) => item.id), updatedBy: EVENTS, updatedAt: nowStamp() }; setState((previous) => ({ ...previous, events: [event, ...previous.events] })); setCreateOpen(false); setForm({ ...form, name: '', date: '', time: '', location: '', targetAudience: '', description: '', expectedParticipants: '' }); };
  const saveResults = () => { if (!selected) return; setState((previous) => ({ ...previous, events: previous.events.map((event) => event.id === selected.id ? { ...event, registrationCount: Number(results.registrationCount) || 0, attendanceCount: Number(results.attendanceCount) || 0, enquiries: Number(results.enquiries) || 0, feedback: results.feedback, status: 'Pending Review', updatedBy: EVENTS, updatedAt: nowStamp() } : event) })); updateState(setState, onNotify, { message: 'Event results updated.', actor: EVENTS, role: 'events', campaignId: selected.campaignId }, { title: 'Event results updated', message: selected.name, role: 'marketing-head' }); setSelected(null); };
  const openResults = (event: WorkflowEvent) => { setSelected(event); setResults({ registrationCount: String(event.registrationCount), attendanceCount: String(event.attendanceCount), enquiries: String(event.enquiries), feedback: event.feedback }); };
  const columns: Column<WorkflowEvent>[] = [{ key: 'name', header: 'Event', render: (row) => <span className="font-medium text-slate-700">{row.name}</span> }, { key: 'campaign', header: 'Campaign', render: (row) => <span className="text-xs text-slate-500">{state.campaigns.find((campaign) => campaign.id === row.campaignId)?.name}</span> }, { key: 'date', header: 'Date', render: (row) => <span className="text-xs text-slate-500">{row.date} {row.time}</span> }, { key: 'location', header: 'Location', render: (row) => <span className="text-xs text-slate-500">{row.location}</span> }, { key: 'registrations', header: 'Registrations', render: (row) => <span>{row.registrationCount}</span> }, { key: 'status', header: 'Status', render: (row) => <Badge variant={workflowVariant(row.status)}>{row.status}</Badge> }];
  return <div><PageHeader title="Events & Outreach Workspace" description="Plan campaign events, use approved materials, track registrations and attendance, and submit results to the Marketing Head." action={<Button icon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>Create Event</Button>} /><div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3"><StatCard label="Events" value={state.events.length} icon={<CalendarDays size={20} />} accent="blue" /><StatCard label="Registrations" value={state.events.reduce((sum, event) => sum + event.registrationCount, 0)} icon={<Users size={20} />} accent="green" /><StatCard label="Attendance" value={state.events.reduce((sum, event) => sum + event.attendanceCount, 0)} icon={<CheckCircle2 size={20} />} accent="indigo" /><StatCard label="Enquiries" value={state.events.reduce((sum, event) => sum + event.enquiries, 0)} icon={<TrendingUp size={20} />} accent="amber" /></div><Card><CardHeader title="Campaign Events and Outreach" subtitle="Select an event to update registrations, attendance, enquiries, and feedback" icon={<CalendarDays size={18} />} /><Table columns={columns} data={state.events} onRowClick={openResults} /></Card><Drawer open={!!selected} onClose={() => setSelected(null)} title="Update Event Results" subtitle={selected?.name} footer={<div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setSelected(null)}>Cancel</Button><Button icon={<Send size={15} />} onClick={saveResults}>Submit Update</Button></div>}>{selected && <div className="space-y-3"><InfoRow label="Campaign" value={state.campaigns.find((campaign) => campaign.id === selected.campaignId)?.name || ''} /><InfoRow label="Approved Materials" value={selected.contentIds.map((id) => state.content.find((item) => item.id === id)?.title).filter(Boolean).join(', ') || 'None attached'} /><div className="grid grid-cols-3 gap-3"><Field label="Registrations"><TextInput type="number" value={results.registrationCount} onChange={(value) => setResults({ ...results, registrationCount: value })} /></Field><Field label="Attendance"><TextInput type="number" value={results.attendanceCount} onChange={(value) => setResults({ ...results, attendanceCount: value })} /></Field><Field label="Enquiries"><TextInput type="number" value={results.enquiries} onChange={(value) => setResults({ ...results, enquiries: value })} /></Field></div><Field label="Feedback"><TextArea value={results.feedback} onChange={(value) => setResults({ ...results, feedback: value })} placeholder="Record attendee feedback" /></Field></div>}</Drawer><Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Event / Outreach Activity" subtitle="Associate the activity with a central campaign" footer={<div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={createEvent} disabled={!form.name.trim() || !form.date}>Create Event</Button></div>}><div className="space-y-3"><Field label="Campaign"><SelectInput value={form.campaignId} onChange={(value) => setForm({ ...form, campaignId: value })} options={state.campaigns.map((campaign) => campaign.id)} /></Field><p className="text-xs text-slate-500">{state.campaigns.find((campaign) => campaign.id === form.campaignId)?.name}</p><Field label="Event Name"><TextInput value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="BCA Open Day" /></Field><div className="grid grid-cols-2 gap-3"><Field label="Event Type"><SelectInput value={form.type} onChange={(value) => setForm({ ...form, type: value as WorkflowEvent['type'] })} options={['Open Day', 'Education Fair', 'Workshop', 'Seminar', 'School Outreach', 'Promotional Event']} /></Field><Field label="Date"><TextInput type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} /></Field></div><div className="grid grid-cols-2 gap-3"><Field label="Time"><TextInput type="time" value={form.time} onChange={(value) => setForm({ ...form, time: value })} /></Field><Field label="Expected Participants"><TextInput type="number" value={form.expectedParticipants} onChange={(value) => setForm({ ...form, expectedParticipants: value })} /></Field></div><Field label="Location"><TextInput value={form.location} onChange={(value) => setForm({ ...form, location: value })} /></Field><Field label="Target Audience"><TextInput value={form.targetAudience} onChange={(value) => setForm({ ...form, targetAudience: value })} /></Field><Field label="Description"><TextArea value={form.description} onChange={(value) => setForm({ ...form, description: value })} /></Field><p className="text-xs text-slate-500">Approved materials for this campaign will be attached automatically. Pending content is never shared.</p></div></Modal></div>;
}
