import { useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Card, CardHeader, CardBody, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { Badge } from '@/components/marketing-pr/components/ui/Badge';
import { Table, type Column } from '@/components/marketing-pr/components/ui/Table';
import { Drawer, Modal } from '@/components/marketing-pr/components/ui/Drawer';
import { PageHeader, SearchInput, FilterDropdown, Button, InfoRow, SectionTitle, EmptyState } from '@/components/marketing-pr/components/ui/Common';
import { ProgressBar } from '@/components/marketing-pr/components/charts/Charts';
import { TEAMS, TEAM_CATEGORIES, TASK_CATEGORIES, TEAM_ROLE, getTaskCategory, normalizeTaskTeam, taskDisplayStatus, taskWorkflowStatus, taskStatusVariant, TaskWorkflowStepper, nowStamp } from '@/components/marketing-pr/components/tasks/TaskShared';
import type { Task, TaskStatus, TaskTeam, TaskCategory, TaskRequest, Priority, Role } from '@/components/marketing-pr/types';
import {
  Users, ClipboardList, Clock, Target, CheckCircle2, SearchCheck,
  Globe, Palette, CalendarDays, Paperclip, Send,
  Info, Link2, RotateCcw,
} from 'lucide-react';

const HEAD = 'Marketing Head / PRO';
const teamMeta: { name: TaskTeam; icon: ReactNode; desc: string }[] = [
  { name: 'Digital Marketing Executive', icon: <Globe size={16} />, desc: 'Runs digital campaigns, website, SEO and social media.' },
  { name: 'Content & Brand Team', icon: <Palette size={16} />, desc: 'Creates prospectus, brochures, newsletters and official college content.' },
  { name: 'Events & Outreach Coordinator', icon: <CalendarDays size={16} />, desc: 'Plans events, school outreach and external coordination.' },
];

export interface TeamCoordinationProps {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  requests: TaskRequest[];
  setRequests: Dispatch<SetStateAction<TaskRequest[]>>;
  onNotify?: (n: { title: string; message: string; role: Role }) => void;
  view?: string;
}

export function TeamCoordination({ tasks, setTasks, requests, setRequests, onNotify, view = 'team-coordination' }: TeamCoordinationProps) {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState<Task | null>(null);
  const [reviewDraft, setReviewDraft] = useState('');
  const [adminComment, setAdminComment] = useState('');
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const dashboardTeam: TaskTeam | null = view === 'digital-team-dashboard'
    ? 'Digital Marketing Executive'
    : view === 'content-team-dashboard'
      ? 'Content & Brand Team'
      : view === 'events-team-dashboard'
        ? 'Events & Outreach Coordinator'
        : null;
  const dashboardTasks = dashboardTeam
    ? tasks.filter((task) => normalizeTaskTeam(task.assignedTeam) === dashboardTeam)
    : tasks;
  const dashboardRequests = dashboardTeam
    ? requests.filter((request) => normalizeTaskTeam(request.assignedTeam) === dashboardTeam)
    : requests;
  const [requestForm, setRequestForm] = useState({
    title: '',
    assignedTeam: TEAMS[0],
    category: TEAM_CATEGORIES[TEAMS[0]][0],
    description: '',
    priority: 'Medium' as Priority,
    dueDate: '',
  });

  const filtered = tasks.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch = t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    const matchesTeam = dashboardTeam
      ? normalizeTaskTeam(t.assignedTeam) === dashboardTeam
      : teamFilter === 'all' || normalizeTaskTeam(t.assignedTeam) === teamFilter;
    const matchesCategory = categoryFilter === 'all' || getTaskCategory(t) === categoryFilter;
    const routeStatus = view === 'pending-review' ? 'Submitted' : view === 'completed-tasks' ? 'Completed' : 'all';
    const selectedStatus = routeStatus;
    const matchesStatus = selectedStatus === 'all'
      || (selectedStatus === 'Submitted'
        ? taskWorkflowStatus(t.status) === 'Submitted'
        : taskDisplayStatus(t) === selectedStatus);
    return matchesSearch && matchesTeam && matchesCategory && matchesStatus;
  });

  // Team Coordination Dashboard stats
  const total = dashboardTasks.length;
  const pending = dashboardTasks.filter((t) => ['Created', 'Assigned'].includes(taskDisplayStatus(t))).length;
  const inProgress = dashboardTasks.filter((t) => taskDisplayStatus(t) === 'In Progress').length;
  const awaitingReview = dashboardTasks.filter((t) => taskWorkflowStatus(t.status) === 'Submitted').length;
  const completed = dashboardTasks.filter((t) => t.status === 'Completed').length;
  const changesRequired = dashboardTasks.filter((t) => taskWorkflowStatus(t.status) === 'Changes Required').length;
  const overdue = dashboardTasks.filter((t) => taskDisplayStatus(t) === 'Overdue').length;

  const openTask = (t: Task) => {
    setSelected(t);
    setReviewDraft('');
    setAdminComment('');
  };

  const handleAdminComment = () => {
    if (!selected || !adminComment.trim()) return;
    const stamp = nowStamp();
    const comment = { id: `C${Date.now()}`, author: HEAD, role: 'head' as const, message: adminComment.trim(), timestamp: stamp };
    setTasks((prev) => prev.map((task) => task.id === selected.id ? {
      ...task,
      comments: [...(task.comments || []), comment],
      activity: [...(task.activity || []), { id: `A${Date.now()}`, author: HEAD, message: 'Marketing Head / PRO added a comment.', timestamp: stamp }],
    } : task));
    setSelected((previous) => previous ? { ...previous, comments: [...(previous.comments || []), comment] } : previous);
    setAdminComment('');
  };

  const handleCreateRequest = () => {
    const categories = TEAM_CATEGORIES[requestForm.assignedTeam] || [];
    if (!requestForm.title.trim() || !requestForm.description.trim() || !requestForm.dueDate || !categories.includes(requestForm.category)) return;
    const nextNumber = requests.reduce((max, request) => Math.max(max, Number(request.id.match(/REQ-(\d+)$/)?.[1]) || 0), 0) + 1;
    const nextTaskNumber = tasks.reduce((max, task) => Math.max(max, Number(task.id.match(/(?:TASK-|T)(\d+)$/)?.[1]) || 0), 0) + 1;
    const taskId = `TASK-${String(nextTaskNumber).padStart(3, '0')}`;
    const stamp = nowStamp();
    const newRequest: TaskRequest = {
      id: `REQ-${String(nextNumber).padStart(3, '0')}`,
      title: requestForm.title.trim(),
      assignedTeam: requestForm.assignedTeam,
      category: requestForm.category,
      description: requestForm.description.trim(),
      priority: requestForm.priority,
      dueDate: requestForm.dueDate,
      createdBy: HEAD,
      createdAt: stamp.slice(0, 10),
      status: 'Accepted',
      linkedTaskId: taskId,
    };
    const assignedTask: Task = {
      id: taskId,
      title: newRequest.title,
      description: newRequest.description,
      assignedTeam: newRequest.assignedTeam,
      category: newRequest.category,
      assignedTo: newRequest.assignedTeam,
      priority: newRequest.priority,
      dueDate: newRequest.dueDate,
      status: 'Assigned',
      createdBy: HEAD,
      createdAt: stamp.slice(0, 10),
      additionalInstructions: newRequest.description,
      progress: 0,
      comments: [],
      attachments: [],
      activity: [{ id: `A${Date.now()}`, author: HEAD, message: 'Task assigned directly from a team request.', timestamp: stamp }],
    };
    setRequests((previous) => [newRequest, ...previous]);
    setTasks((previous) => [assignedTask, ...previous]);
    const recipientRole = TEAM_ROLE[newRequest.assignedTeam];
    if (recipientRole) onNotify?.({ title: 'New Task Assigned', message: `${newRequest.id}: ${newRequest.title}`, role: recipientRole });
    setRequestForm({ title: '', assignedTeam: TEAMS[0], category: TEAM_CATEGORIES[TEAMS[0]][0], description: '', priority: 'Medium', dueDate: '' });
    setShowCreateRequest(false);
  };

  const handleApprove = () => {
    if (!selected) return;
    const stamp = nowStamp();
    const comment = reviewDraft.trim();
    setTasks((prev) => prev.map((t) => t.id === selected.id ? {
      ...t,
      status: 'Completed' as TaskStatus,
      progress: 100,
      completedAt: stamp.split(' ')[0],
      reviewComments: comment || t.reviewComments,
      activity: [...(t.activity || []), { id: `A${Date.now()}`, author: HEAD, message: comment ? `Work approved. Review comments: "${comment}" Task completed.` : 'Work reviewed and approved. Task completed.', timestamp: stamp }],
    } : t));
    setRequests((previous) => previous.map((request) => request.linkedTaskId === selected.id
      ? { ...request, status: 'Completed' }
      : request));
    const recipientRole = TEAM_ROLE[selected.assignedTeam];
    if (recipientRole) onNotify?.({ title: 'Task Approved', message: `Your task "${selected.title}" was approved and marked as completed`, role: recipientRole });
    setSelected(null);
    setReviewDraft('');
  };

  const handleRequestChanges = () => {
    if (!selected || !reviewDraft.trim()) return;
    const stamp = nowStamp();
    setTasks((prev) => prev.map((t) => t.id === selected.id ? {
      ...t,
      status: 'Changes Required' as TaskStatus,
      reviewComments: reviewDraft.trim(),
      activity: [...(t.activity || []), { id: `A${Date.now()}`, author: HEAD, message: 'Changes requested. Task sent back to the team for revision.', timestamp: stamp }],
    } : t));
    setRequests((previous) => previous.map((request) => request.linkedTaskId === selected.id
      ? { ...request, status: 'Changes Required' }
      : request));
    const recipientRole = TEAM_ROLE[selected.assignedTeam];
    if (recipientRole) onNotify?.({ title: 'Changes Requested', message: `Changes were requested on task "${selected.title}". Please revise and resubmit.`, role: recipientRole });
    setSelected(null);
    setReviewDraft('');
  };

  const columns: Column<Task>[] = [
    { key: 'title', header: 'Task', render: (row) => (
      <div>
        <span className="font-medium text-slate-700">{row.title}</span>
        {row.relatedTo && (
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Link2 size={11} />{row.relatedTo}</p>
        )}
      </div>
    )},
    { key: 'category', header: 'Category', render: (row) => <Badge variant="slate">{getTaskCategory(row)}</Badge> },
    { key: 'creator', header: 'Created By', render: (row) => {
      const category = getTaskCategory(row);
      const creator = category === 'Brochures'
        ? 'Content / Brand Team'
        : ['Open Days', 'School Partnerships'].includes(category)
          ? 'Events & Outreach Coordinator'
          : ['Social Media', 'SEO'].includes(category)
          ? 'Digital Marketing Executive'
          : row.createdBy;
      return <span className="text-xs text-slate-500">{creator}</span>;
    } },
    { key: 'priority', header: 'Priority', render: (row) => <Badge variant={row.priority === 'High' ? 'red' : row.priority === 'Medium' ? 'amber' : 'slate'}>{row.priority}</Badge> },
    { key: 'due', header: 'Due Date', render: (row) => <span className="text-slate-500 text-xs">{row.dueDate}</span> },
    { key: 'progress', header: 'Progress', render: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.progress ?? 0}%` }} />
        </div>
        <span className="text-xs text-slate-500">{row.progress ?? 0}%</span>
      </div>
    )},
    { key: 'status', header: 'Status', render: (row) => {
      const status = taskDisplayStatus(row);
      return <Badge variant={taskStatusVariant(status)}>{status}</Badge>;
    } },
    { key: 'action', header: 'Action', render: (row) => (
      <button onClick={(e) => { e.stopPropagation(); openTask(row); }} className={`text-xs hover:underline font-medium ${taskWorkflowStatus(row.status) === 'Submitted' ? 'text-indigo-600' : 'text-blue-600'}`}>
        {taskWorkflowStatus(row.status) === 'Submitted' ? 'Review Submission' : 'View'}
      </button>
    )},
  ];

  const requestColumns: Column<TaskRequest>[] = [
    { key: 'id', header: 'Request ID', render: (request) => <span className="text-xs font-medium text-slate-500">{request.id}</span> },
    { key: 'title', header: 'Request', render: (request) => <div><p className="font-medium text-slate-700">{request.title}</p><p className="text-xs text-slate-500 mt-0.5">{request.description}</p></div> },
    { key: 'team', header: 'Team', render: (request) => <Badge variant="slate">{normalizeTaskTeam(request.assignedTeam)}</Badge> },
    { key: 'category', header: 'Category', render: (request) => <Badge variant="slate">{request.category}</Badge> },
    { key: 'priority', header: 'Priority', render: (request) => <Badge variant={request.priority === 'High' ? 'red' : request.priority === 'Medium' ? 'amber' : 'slate'}>{request.priority}</Badge> },
    { key: 'deadline', header: 'Deadline', render: (request) => <span className="text-xs text-slate-500">{request.dueDate}</span> },
    { key: 'status', header: 'Status', render: (request) => <Badge variant={request.status === 'Completed' ? 'green' : request.status === 'Changes Required' ? 'red' : request.status === 'Submitted' ? 'indigo' : request.status === 'In Progress' ? 'blue' : 'amber'}>{request.status === 'Submitted' ? 'Pending Review' : request.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title={dashboardTeam ? `${dashboardTeam} Dashboard` : 'Dashboard'}
        description={dashboardTeam ? `Monitor ${dashboardTeam} tasks, requests, deadlines, progress, and submitted work.` : 'Monitor tasks created by the three teams, track deadlines and progress, and review submitted work.'}
        action={view === 'team-coordination' ? undefined : <Button variant="primary" icon={<Send size={16} />} onClick={() => setShowCreateRequest(true)}>Send Request</Button>}
      />

      {/* Team Coordination Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2 mb-3">
        <StatCard label="Total Tasks" value={total} icon={<ClipboardList size={20} />} accent="slate" />
        <StatCard label="New Tasks" value={pending} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="In Progress" value={inProgress} icon={<Target size={20} />} accent="blue" />
        <StatCard label="Pending Review" value={awaitingReview} icon={<SearchCheck size={20} />} accent="indigo" />
        <StatCard label="Completed" value={completed} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="Changes Required" value={changesRequired} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="Overdue" value={overdue} icon={<Clock size={20} />} accent="red" />
      </div>

      {/* Teams Under Coordination */}
      {!dashboardTeam && (
        <Card className="mb-3">
          <CardHeader title="Team Activity" subtitle="Work created and updated by each Marketing & PR team" icon={<Users size={18} />} />
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TEAMS.map((name) => {
                const team = teamMeta.find((item) => item.name === name) || { name, icon: <Users size={16} />, desc: 'Internal team.' };
                const teamTasks = tasks.filter((t) => normalizeTaskTeam(t.assignedTeam) === name);
                const active = teamTasks.filter((t) => t.status !== 'Completed').length;
                const done = teamTasks.filter((t) => t.status === 'Completed').length;
                return (
                  <div key={team.name} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
                        {team.icon}
                      </div>
                      <p className="text-xs font-semibold text-slate-700 leading-tight">{team.name}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mb-2">{team.desc}</p>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="blue">{active} Active</Badge>
                      <Badge variant="green">{done} Completed</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="mb-3">
        <CardHeader title={dashboardTeam ? `${dashboardTeam} Requests` : 'Team Requests'} subtitle="Sent requests are assigned immediately and tracked through review and completion" icon={<Send size={18} />} />
        <Table columns={requestColumns} data={dashboardRequests} emptyMessage="No team requests sent yet" />
      </Card>

      {/* All Assigned Tasks */}
      <Card>
        <CardHeader title={dashboardTeam ? `${dashboardTeam} Tasks` : 'All Assigned Tasks'} subtitle="Click a task to view details, team updates and review actions" icon={<ClipboardList size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search tasks..." /></div>
          {!dashboardTeam && <FilterDropdown label="Team" value={teamFilter} options={TEAMS} onChange={setTeamFilter} />}
          <FilterDropdown label="Category" value={categoryFilter} options={TASK_CATEGORIES} onChange={setCategoryFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={openTask} emptyMessage="No tasks found" />
      </Card>

      <Modal
        open={showCreateRequest}
        onClose={() => setShowCreateRequest(false)}
        title="Create Request"
        subtitle="Send a work request to one of the Marketing & PR teams"
        size="max-w-lg"
        footer={(
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowCreateRequest(false)}>Cancel</Button>
            <Button variant="primary" icon={<Send size={16} />} onClick={handleCreateRequest} disabled={!requestForm.title.trim() || !requestForm.description.trim() || !requestForm.dueDate}>Send Request</Button>
          </div>
        )}
      >
        <div className="space-y-3">
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Request ID</span>
            <input value="Assigned automatically" readOnly className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500" />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Request Title *</span>
            <input value={requestForm.title} onChange={(event) => setRequestForm({ ...requestForm, title: event.target.value })} placeholder="Enter request title" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-medium text-slate-500 mb-1">Select Team *</span>
              <select value={requestForm.assignedTeam} onChange={(event) => {
                const assignedTeam = event.target.value;
                setRequestForm({ ...requestForm, assignedTeam, category: TEAM_CATEGORIES[assignedTeam][0] });
              }} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                {TEAMS.map((team) => <option key={team} value={team}>{team}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-slate-500 mb-1">Select Category *</span>
              <select value={requestForm.category} onChange={(event) => setRequestForm({ ...requestForm, category: event.target.value as TaskCategory })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                {(TEAM_CATEGORIES[requestForm.assignedTeam] || []).map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Description / Instructions *</span>
            <textarea value={requestForm.description} onChange={(event) => setRequestForm({ ...requestForm, description: event.target.value })} rows={3} placeholder="Describe the request and instructions" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-medium text-slate-500 mb-1">Priority</span>
              <select value={requestForm.priority} onChange={(event) => setRequestForm({ ...requestForm, priority: event.target.value as Priority })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                {(['Low', 'Medium', 'High'] as Priority[]).map((priority) => <option key={priority} value={priority}>{priority}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-slate-500 mb-1">Deadline *</span>
              <input type="date" value={requestForm.dueDate} onChange={(event) => setRequestForm({ ...requestForm, dueDate: event.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </label>
          </div>
        </div>
      </Modal>

      {/* Task Detail / Review Drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={taskWorkflowStatus(selected?.status || 'Assigned') === 'Submitted' ? 'Review Submission' : 'Task Details'}
        subtitle={selected?.title}
        footer={
          selected && (
            taskWorkflowStatus(selected.status) === 'Submitted' ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={reviewDraft}
                  onChange={(e) => setReviewDraft(e.target.value)}
                  rows={2}
                  placeholder="Add review comments (required when requesting changes)..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
                  <Button variant="secondary" icon={<RotateCcw size={14} />} onClick={handleRequestChanges} disabled={!reviewDraft.trim()}>Request Changes</Button>
                  <Button variant="success" icon={<CheckCircle2 size={16} />} onClick={handleApprove}>Approve & Complete</Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
              </div>
            )
          )
        }
      >
        {selected && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge variant={taskStatusVariant(taskDisplayStatus(selected))}>{taskDisplayStatus(selected)}</Badge>
              <Badge variant={selected.priority === 'High' ? 'red' : selected.priority === 'Medium' ? 'amber' : 'slate'}>{selected.priority} Priority</Badge>
              <Badge variant="slate">{selected.assignedTeam}</Badge>
            </div>

            <div className="mb-4">
              <SectionTitle title="Workflow" />
              <TaskWorkflowStepper status={taskWorkflowStatus(selected.status)} />
            </div>

            {taskWorkflowStatus(selected.status) === 'Submitted' && (
              <div className="flex items-start gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg mb-4">
                <Info size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-indigo-700">{selected.assignedTeam} has submitted work for your review. Check the submitted material below, then approve it or request changes.</p>
              </div>
            )}

            {taskWorkflowStatus(selected.status) === 'Changes Required' && selected.reviewComments && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg mb-4">
                <p className="text-xs font-semibold text-red-700 mb-1">Changes Requested — awaiting team revision</p>
                <p className="text-xs text-red-600">{selected.reviewComments}</p>
              </div>
            )}

            {selected.status === 'Completed' && selected.reviewComments && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg mb-4">
                <p className="text-xs font-semibold text-emerald-700 mb-1">Approved with feedback</p>
                <p className="text-xs text-emerald-600">{selected.reviewComments}</p>
              </div>
            )}

            <InfoRow label="Task Title" value={selected.title} />
            <InfoRow label="Description" value={selected.description || '—'} />
            <InfoRow label="Assigned Team" value={normalizeTaskTeam(selected.assignedTeam)} />
            <InfoRow label="Task Category" value={getTaskCategory(selected)} />
            <InfoRow label="Assigned To" value={selected.createdBy} />
            <InfoRow label="Created By" value={selected.assignedTo || normalizeTaskTeam(selected.assignedTeam)} />
            <InfoRow label="Related Campaign / Event" value={selected.relatedTo || '—'} />
            <InfoRow label="Additional Instructions" value={selected.additionalInstructions || '—'} />
            <InfoRow label="Assigned To" value={selected.createdBy} />
            <InfoRow label="Created Date" value={selected.createdAt} />
            <InfoRow label="Due Date" value={selected.dueDate} />
            {selected.submittedAt && <InfoRow label="Submitted On" value={selected.submittedAt} />}
            {selected.completedAt && <InfoRow label="Completed On" value={selected.completedAt} />}

            <div className="pt-3">
              <SectionTitle title="Progress" />
              <ProgressBar value={selected.progress ?? 0} label="Completion" color="bg-blue-500" />
            </div>

            <div className="pt-3">
              <SectionTitle title="Submitted Material" />
              {selected.attachments && selected.attachments.length > 0 ? (
                <div className="space-y-2">
                  {selected.attachments.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
                        <Paperclip size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-700 truncate">{f.name}</p>
                        <p className="text-[11px] text-slate-400">{f.fileType} • {f.size} • Uploaded by {f.uploadedBy} on {f.uploadedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={<Paperclip size={20} />} title="No materials uploaded yet" message="Files uploaded by the team will appear here for review." />
              )}
            </div>

            <div className="pt-3">
              <SectionTitle title="Team Comments" />
              {selected.comments && selected.comments.length > 0 ? (
                <div className="space-y-2">
                  {selected.comments.map((c) => (
                    <div key={c.id} className={`p-2.5 rounded-lg ${c.role === 'head' ? 'bg-blue-50' : 'bg-slate-50'}`}>
                      <p className="text-xs">
                        <span className="font-semibold text-slate-700">{c.author}</span>
                        <span className="text-slate-300"> • </span>
                        <span className="text-slate-400">{c.timestamp}</span>
                      </p>
                      <p className="text-sm text-slate-600 mt-0.5">{c.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No comments yet.</p>
              )}
              <div className="mt-2">
                <textarea
                  value={adminComment}
                  onChange={(event) => setAdminComment(event.target.value)}
                  rows={2}
                  placeholder="Add an instruction or comment for the assigned team..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button variant="secondary" size="sm" onClick={handleAdminComment} disabled={!adminComment.trim()}>Add Comment</Button>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <SectionTitle title="Activity Log" />
              {selected.activity && selected.activity.length > 0 ? (
                <div className="space-y-2">
                  {selected.activity.map((a) => (
                    <div key={a.id} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-slate-600">
                        {a.message}
                        <span className="text-[11px] text-slate-400"> — {a.author} • {a.timestamp}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No activity recorded yet.</p>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
