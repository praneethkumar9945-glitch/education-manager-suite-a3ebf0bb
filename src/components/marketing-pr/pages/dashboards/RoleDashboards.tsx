import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Activity, BarChart3, CalendarDays, CheckCircle2, ClipboardList, Clock,
  FileCheck2, FileText, FolderOpen, Globe, Handshake, History, Plus,
  SearchCheck, Send, Target, TrendingUp, Users, Zap,
} from 'lucide-react';
import { Card, CardBody, CardHeader, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { Badge } from '@/components/marketing-pr/components/ui/Badge';
import { Table, type Column } from '@/components/marketing-pr/components/ui/Table';
import { Button, FilterDropdown, PageHeader, SearchInput } from '@/components/marketing-pr/components/ui/Common';
import { BarChart, ProgressBar } from '@/components/marketing-pr/components/charts/Charts';
import { TEAMS, getTaskCategory, normalizeTaskTeam, nowStamp, taskDisplayStatus, taskStatusVariant } from '@/components/marketing-pr/components/tasks/TaskShared';
import type { Task, TaskCategory, TaskRequest, TaskTeam } from '@/components/marketing-pr/types';

// ---------- shared types & helpers (single shared task/request data system) ----------

type Accent = 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'indigo';

export interface RoleDashboardProps {
  tasks: Task[];
  requests: TaskRequest[];
  onNavigate: (pageId: string) => void;
}

const TEAM_SHORT: Record<string, string> = {
  'Digital Marketing Executive': 'Digital Marketing',
  'Content & Brand Team': 'Content / Brand',
  'Events & Outreach Coordinator': 'Events & Outreach',
};

const CATEGORY_KPI_LABEL: Record<TaskCategory, string> = {
  Website: 'Website Tasks',
  'Social Media': 'Social Media Tasks',
  SEO: 'SEO Tasks',
  'Ad Campaigns': 'Ad Campaign Tasks',
  Prospectus: 'Prospectus Tasks',
  Brochures: 'Brochure Tasks',
  Newsletters: 'Newsletter Tasks',
  'Education Fairs': 'Education Fair Tasks',
  'School Partnerships': 'School Partnership Tasks',
  'Open Days': 'Open Day Tasks',
};

const CATEGORY_ICON: Record<TaskCategory, ReactNode> = {
  Website: <Globe size={20} />,
  'Social Media': <Users size={20} />,
  SEO: <TrendingUp size={20} />,
  'Ad Campaigns': <Target size={20} />,
  Prospectus: <FileText size={20} />,
  Brochures: <FolderOpen size={20} />,
  Newsletters: <Send size={20} />,
  'Education Fairs': <CalendarDays size={20} />,
  'School Partnerships': <Handshake size={20} />,
  'Open Days': <CalendarDays size={20} />,
};

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface StatusCounts {
  total: number; isNew: number; inProgress: number; submitted: number;
  underReview: number; changesRequired: number; completed: number; overdue: number; pendingReview: number;
}

function statusCounts(list: Task[]): StatusCounts {
  const display = (t: Task) => taskDisplayStatus(t);
  const isNew = list.filter((t) => ['Created', 'Assigned'].includes(display(t))).length;
  const inProgress = list.filter((t) => display(t) === 'In Progress').length;
  const underReview = list.filter((t) => t.status === 'Under Review').length;
  const submitted = list.filter((t) => display(t) === 'Submitted' && t.status !== 'Under Review').length;
  const changesRequired = list.filter((t) => display(t) === 'Changes Required').length;
  const completed = list.filter((t) => t.status === 'Completed').length;
  const overdue = list.filter((t) => display(t) === 'Overdue').length;
  return { total: list.length, isNew, inProgress, submitted, underReview, changesRequired, completed, overdue, pendingReview: submitted + underReview };
}

function monthBuckets(list: Task[], months = 6): { label: string; created: number; completed: number }[] {
  const now = new Date();
  const buckets: { label: string; key: string; created: number; completed: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ label: d.toLocaleString('en-US', { month: 'short' }), key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, created: 0, completed: 0 });
  }
  list.forEach((t) => {
    const createdKey = (t.createdAt || '').slice(0, 7);
    const bucket = buckets.find((b) => b.key === createdKey);
    if (bucket) bucket.created += 1;
    const completedKey = (t.completedAt || '').slice(0, 7);
    const completedBucket = buckets.find((b) => b.key === completedKey);
    if (completedBucket && completedKey) completedBucket.completed += 1;
  });
  return buckets.map(({ label, created, completed }) => ({ label, created, completed }));
}

interface ActivityItem { key: string; message: string; author: string; timestamp: string; }

function buildActivityFeed(tasks: Task[], requests: TaskRequest[], limit = 9): ActivityItem[] {
  const items: ActivityItem[] = [];
  tasks.forEach((t) => (t.activity || []).forEach((a) => items.push({ key: `${t.id}-${a.id}`, message: `${t.id} — ${a.message}`, author: a.author, timestamp: a.timestamp })));
  requests.forEach((r) => items.push({ key: `req-${r.id}`, message: `${r.id} — Request "${r.title}" created for ${r.assignedTeam}`, author: r.createdBy, timestamp: `${r.createdAt} 09:00` }));
  return items.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
}

// ---------- dashboard building blocks ----------

function KpiGrid({ cards }: { cards: { label: string; value: number; icon: ReactNode; accent: Accent }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
      {cards.map((c) => <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} accent={c.accent} />)}
    </div>
  );
}

function CategoryChartCard({ title, data }: { title: string; data: { label: string; value: number; color?: string }[] }) {
  return (
    <Card>
      <CardHeader title={title} subtitle="Live counts from the shared task system" icon={<BarChart3 size={18} />} />
      <CardBody><BarChart data={data} height={200} /></CardBody>
    </Card>
  );
}

function StatusChartCard({ title, data }: { title: string; data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <Card>
      <CardHeader title={title} subtitle="Current workload by status" icon={<Activity size={18} />} />
      <CardBody>
        <div className="space-y-2.5">
          {data.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="w-32 flex-shrink-0 text-xs text-slate-500 truncate" title={d.label}>{d.label}</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${d.color}`} style={{ width: `${(d.value / max) * 100}%` }} />
              </div>
              <span className="w-8 text-right text-xs font-semibold text-slate-700">{d.value}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function TrendChartCard({ title, data }: { title: string; data: { label: string; created: number; completed: number }[] }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.created, d.completed]));
  return (
    <Card>
      <CardHeader title={title} subtitle="Tasks created vs completed each month" icon={<TrendingUp size={18} />} />
      <CardBody>
        <div className="flex items-end gap-3 h-40">
          {data.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
              <div className="flex items-end justify-center gap-1.5 w-full h-full">
                <div className="w-6 bg-blue-500 rounded-t-md transition-all duration-500" style={{ height: `${d.created === 0 ? 2 : Math.max((d.created / max) * 100, 6)}%` }} title={`Created: ${d.created}`} />
                <div className="w-6 bg-emerald-500 rounded-t-md transition-all duration-500" style={{ height: `${d.completed === 0 ? 2 : Math.max((d.completed / max) * 100, 6)}%` }} title={`Completed: ${d.completed}`} />
              </div>
              <span className="text-[10px] text-slate-400">{d.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" />Created</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Completed</span>
        </div>
      </CardBody>
    </Card>
  );
}

function QuickActionsCard({ actions }: { actions: { label: string; icon: ReactNode; onClick: () => void }[] }) {
  return (
    <Card>
      <CardHeader title="Quick Actions" icon={<Zap size={18} />} />
      <CardBody>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {actions.map((a) => (
            <div key={a.label}><Button variant="secondary" icon={a.icon} onClick={a.onClick}>{a.label}</Button></div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// ---------- 1. Marketing Head / PRO Dashboard ----------

export function HeadDashboard({ tasks, requests, onNavigate }: RoleDashboardProps) {
  const counts = statusCounts(tasks);
  const newRequests = requests.filter((r) => r.status === 'Pending Acceptance').length;
  const kpis = [
    { label: 'Total Requests', value: requests.length, icon: <Send size={20} />, accent: 'blue' as Accent },
    { label: 'Total Tasks', value: counts.total, icon: <ClipboardList size={20} />, accent: 'slate' as Accent },
    { label: 'New Requests', value: newRequests, icon: <Plus size={20} />, accent: 'amber' as Accent },
    { label: 'In Progress', value: counts.inProgress, icon: <Target size={20} />, accent: 'blue' as Accent },
    { label: 'Pending Review', value: counts.pendingReview, icon: <SearchCheck size={20} />, accent: 'indigo' as Accent },
    { label: 'Completed', value: counts.completed, icon: <CheckCircle2 size={20} />, accent: 'green' as Accent },
    { label: 'Changes Required', value: counts.changesRequired, icon: <FileCheck2 size={20} />, accent: 'red' as Accent },
    { label: 'Overdue Tasks', value: counts.overdue, icon: <Clock size={20} />, accent: 'red' as Accent },
  ];
  const teamColors = ['bg-blue-500', 'bg-violet-500', 'bg-amber-500'];
  const byTeam = TEAMS.map((team, i) => ({ label: TEAM_SHORT[team] || team, value: tasks.filter((t) => normalizeTaskTeam(t.assignedTeam) === team).length, color: teamColors[i] ?? 'bg-slate-500' }));
  const statusData = [
    { label: 'New', value: counts.isNew, color: 'bg-amber-500' },
    { label: 'In Progress', value: counts.inProgress, color: 'bg-blue-500' },
    { label: 'Submitted', value: counts.submitted, color: 'bg-indigo-500' },
    { label: 'Under Review', value: counts.underReview, color: 'bg-violet-500' },
    { label: 'Completed', value: counts.completed, color: 'bg-emerald-500' },
    { label: 'Changes Required', value: counts.changesRequired, color: 'bg-red-500' },
    { label: 'Overdue', value: counts.overdue, color: 'bg-rose-500' },
  ];
  const trend = monthBuckets(tasks);
  const pendingTasks = tasks.filter((t) => taskDisplayStatus(t) === 'Submitted').sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
  const feed = buildActivityFeed(tasks, requests);
  const pendingColumns: Column<Task>[] = [
    { key: 'task', header: 'Task', render: (t) => <div><p className="font-medium text-slate-700">{t.title}</p><p className="text-xs text-slate-400">{t.id}</p></div> },
    { key: 'team', header: 'Team', render: (t) => <Badge variant="slate">{normalizeTaskTeam(t.assignedTeam)}</Badge> },
    { key: 'category', header: 'Category', render: (t) => <Badge variant="slate">{getTaskCategory(t)}</Badge> },
    { key: 'submitted', header: 'Submitted', render: (t) => <span className="text-xs text-slate-500">{(t.submittedAt || '').slice(0, 10) || '—'}</span> },
    { key: 'status', header: 'Status', render: (t) => <Badge variant={taskStatusVariant(taskDisplayStatus(t))}>{taskDisplayStatus(t)}</Badge> },
    { key: 'action', header: 'Action', render: () => <Button size="sm" onClick={() => onNavigate('pending-review')}>Review</Button> },
  ];

  return (
    <div>
      <PageHeader
        title="Marketing Head / PRO Dashboard"
        description="Oversee branding, media relations and reputation management while monitoring the work of all three teams. Every number updates live from the shared task system."
      />
      <KpiGrid cards={kpis} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <CategoryChartCard title="Tasks by Team" data={byTeam} />
        <StatusChartCard title="Task Status Overview" data={statusData} />
      </div>
      <div className="mb-3"><TrendChartCard title="Work Trend" data={trend} /></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Pending Review" subtitle="Recently submitted tasks waiting for your review" icon={<SearchCheck size={18} />} />
          <Table columns={pendingColumns} data={pendingTasks} emptyMessage="No submissions awaiting review" />
        </Card>
        <Card>
          <CardHeader title="Recent Activity" subtitle="Latest actions across all teams" icon={<History size={18} />} />
          <CardBody>
            {feed.length === 0 ? (
              <p className="text-xs text-slate-400">No activity recorded yet.</p>
            ) : (
              <div className="space-y-2.5">
                {feed.map((item) => (
                  <div key={item.key} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-600 leading-snug">{item.message}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.author} • {item.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
      <QuickActionsCard
        actions={[
          { label: 'Create Request', icon: <Send size={16} />, onClick: () => onNavigate('team-coordination') },
          { label: 'View All Tasks', icon: <ClipboardList size={16} />, onClick: () => onNavigate('team-coordination') },
          { label: 'Pending Reviews', icon: <SearchCheck size={16} />, onClick: () => onNavigate('pending-review') },
          { label: 'Team Activity', icon: <Users size={16} />, onClick: () => onNavigate('team-coordination') },
        ]}
      />
    </div>
  );
}

// ---------- shared team dashboard base (Digital / Content / Events) ----------

interface TeamDashboardBaseProps extends RoleDashboardProps {
  teamName: TaskTeam;
  headerTitle: string;
  headerDescription: string;
  totalLabel: string;
  categories: TaskCategory[];
  categoryChartTitle: string;
  newLabel: string;
  tailKpis: ('planned' | 'inProgress' | 'pending' | 'completed' | 'changes')[];
  renderList: (teamTasks: Task[]) => ReactNode;
}

function TeamDashboardBase({ tasks, onNavigate, teamName, headerTitle, headerDescription, totalLabel, categories, categoryChartTitle, newLabel, tailKpis, renderList }: TeamDashboardBaseProps) {
  const teamTasks = tasks.filter((t) => normalizeTaskTeam(t.assignedTeam) === teamName);
  const counts = statusCounts(teamTasks);
  const barColors = ['bg-blue-500', 'bg-violet-500', 'bg-cyan-500', 'bg-amber-500'];
  const byCategory = categories.map((c, i) => ({ label: c, value: teamTasks.filter((t) => getTaskCategory(t) === c).length, color: barColors[i % barColors.length] ?? 'bg-slate-500' }));
  const statusData = [
    { label: newLabel, value: counts.isNew, color: 'bg-amber-500' },
    { label: 'In Progress', value: counts.inProgress, color: 'bg-blue-500' },
    { label: 'Submitted', value: counts.submitted, color: 'bg-indigo-500' },
    { label: 'Under Review', value: counts.underReview, color: 'bg-violet-500' },
    { label: 'Completed', value: counts.completed, color: 'bg-emerald-500' },
    { label: 'Changes Required', value: counts.changesRequired, color: 'bg-red-500' },
  ];
  const tailMap: Record<string, { label: string; value: number; icon: ReactNode; accent: Accent }> = {
    planned: { label: 'Planned', value: counts.isNew, icon: <CalendarDays size={20} />, accent: 'amber' },
    inProgress: { label: 'In Progress', value: counts.inProgress, icon: <Target size={20} />, accent: 'blue' },
    pending: { label: 'Pending Review', value: counts.pendingReview, icon: <SearchCheck size={20} />, accent: 'indigo' },
    completed: { label: 'Completed', value: counts.completed, icon: <CheckCircle2 size={20} />, accent: 'green' },
    changes: { label: 'Changes Required', value: counts.changesRequired, icon: <FileCheck2 size={20} />, accent: 'red' },
  };
  const kpis = [
    { label: totalLabel, value: counts.total, icon: <ClipboardList size={20} />, accent: 'slate' as Accent },
    ...categories.map((c) => ({ label: CATEGORY_KPI_LABEL[c], value: teamTasks.filter((t) => getTaskCategory(t) === c).length, icon: CATEGORY_ICON[c], accent: 'blue' as Accent })),
    ...tailKpis.map((k) => tailMap[k]!),
  ];
  const trend = monthBuckets(teamTasks);

  return (
    <div>
      <PageHeader
        title={headerTitle}
        description={headerDescription}
        action={<Button icon={<ClipboardList size={16} />} onClick={() => onNavigate('my-tasks')}>My Tasks</Button>}
      />
      <KpiGrid cards={kpis} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <CategoryChartCard title={categoryChartTitle} data={byCategory} />
        <StatusChartCard title="Task Status Overview" data={statusData} />
      </div>
      <div className="mb-3"><TrendChartCard title="Work Trend" data={trend} /></div>
      {renderList(teamTasks)}
      <QuickActionsCard
        actions={[
          { label: 'Create Task', icon: <Plus size={16} />, onClick: () => onNavigate('my-tasks') },
          { label: 'View New Requests', icon: <Send size={16} />, onClick: () => onNavigate('my-tasks') },
          { label: 'Update Task', icon: <Target size={16} />, onClick: () => onNavigate('my-tasks') },
          { label: 'Submit for Review', icon: <CheckCircle2 size={16} />, onClick: () => onNavigate('my-tasks') },
        ]}
      />
    </div>
  );
}

// ---------- 2. Digital Marketing Executive Dashboard ----------

export function DigitalDashboard(props: RoleDashboardProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const today = nowStamp().slice(0, 10);
  const now = new Date();
  const weekEnd = fmtDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7));
  const monthEnd = fmtDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));

  const columns: Column<Task>[] = [
    { key: 'task', header: 'Task Name', render: (t) => <div><p className="font-medium text-slate-700">{t.title}</p><p className="text-xs text-slate-400">{t.id}</p></div> },
    { key: 'category', header: 'Category', render: (t) => <Badge variant="slate">{getTaskCategory(t)}</Badge> },
    { key: 'priority', header: 'Priority', render: (t) => <Badge variant={t.priority === 'High' ? 'red' : t.priority === 'Medium' ? 'amber' : 'slate'}>{t.priority}</Badge> },
    { key: 'deadline', header: 'Deadline', render: (t) => <span className="text-xs text-slate-500">{t.dueDate}</span> },
    { key: 'progress', header: 'Progress', render: (t) => <div className="w-24"><ProgressBar value={t.progress ?? 0} /></div> },
    { key: 'status', header: 'Status', render: (t) => <Badge variant={taskStatusVariant(taskDisplayStatus(t))}>{taskDisplayStatus(t)}</Badge> },
  ];

  return (
    <TeamDashboardBase
      {...props}
      teamName="Digital Marketing Executive"
      headerTitle="Digital Marketing Executive Dashboard"
      headerDescription="Manage and analyze internal website, social media, SEO and ad campaign tasks. All metrics are counted from tasks recorded in this system — no external platform analytics."
      totalLabel="Total Digital Marketing Tasks"
      categories={['Website', 'Social Media', 'SEO', 'Ad Campaigns']}
      categoryChartTitle="Digital Marketing Tasks by Category"
      newLabel="New"
      tailKpis={['inProgress', 'pending', 'completed']}
      renderList={(teamTasks) => {
        const q = search.toLowerCase();
        const filtered = teamTasks.filter((t) => {
          const display = taskDisplayStatus(t);
          const matchesSearch = t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
          const matchesCategory = categoryFilter === 'all' || getTaskCategory(t) === categoryFilter;
          const matchesStatus = statusFilter === 'all' || (statusFilter === 'New' ? ['Created', 'Assigned'].includes(display) : display === statusFilter);
          const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
          let matchesDate = true;
          if (dateFilter === 'Overdue') matchesDate = display === 'Overdue';
          else if (dateFilter === 'Due This Week') matchesDate = !!t.dueDate && display !== 'Completed' && t.dueDate >= today && t.dueDate <= weekEnd;
          else if (dateFilter === 'Due This Month') matchesDate = !!t.dueDate && display !== 'Completed' && t.dueDate >= today && t.dueDate <= monthEnd;
          return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesDate;
        });
        return (
          <Card className="mb-3">
            <CardHeader title="Digital Marketing Task List" subtitle="Filter tasks by category, status, priority and date" icon={<ClipboardList size={18} />} />
            <div className="px-5 py-3 border-b border-slate-100 flex flex-col lg:flex-row gap-2 lg:items-center flex-wrap">
              <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search tasks..." /></div>
              <FilterDropdown label="Category" value={categoryFilter} options={['Website', 'Social Media', 'SEO', 'Ad Campaigns']} onChange={setCategoryFilter} />
              <FilterDropdown label="Status" value={statusFilter} options={['New', 'In Progress', 'Submitted', 'Changes Required', 'Completed', 'Overdue']} onChange={setStatusFilter} />
              <FilterDropdown label="Priority" value={priorityFilter} options={['Low', 'Medium', 'High']} onChange={setPriorityFilter} />
              <FilterDropdown label="Date" value={dateFilter} options={['Due This Week', 'Due This Month', 'Overdue']} onChange={setDateFilter} />
            </div>
            <Table columns={columns} data={filtered} emptyMessage="No tasks match the selected filters" />
          </Card>
        );
      }}
    />
  );
}

// __MORE_SECTIONS__




