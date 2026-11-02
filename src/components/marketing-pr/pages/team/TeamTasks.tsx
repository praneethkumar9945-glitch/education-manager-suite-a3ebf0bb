import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Card, CardHeader, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { Badge } from '@/components/marketing-pr/components/ui/Badge';
import { Table, type Column } from '@/components/marketing-pr/components/ui/Table';
import { Drawer, Modal } from '@/components/marketing-pr/components/ui/Drawer';
import { PageHeader, SearchInput, FilterDropdown, Button, InfoRow, SectionTitle } from '@/components/marketing-pr/components/ui/Common';
import { ProgressBar } from '@/components/marketing-pr/components/charts/Charts';
import { TASK_STATUSES, TEAM_CATEGORIES, getTaskCategory, normalizeTaskTeam, requestStatusFromTask, taskDisplayStatus, taskWorkflowStatus, taskStatusVariant, TaskWorkflowStepper, nowStamp } from '@/components/marketing-pr/components/tasks/TaskShared';
import type { Task, TaskStatus, TaskAttachment, TaskTeam, TaskCategory, TaskRequest, Priority, Role } from '@/components/marketing-pr/types';
import {
  ClipboardList, Clock, Target, CheckCircle2, Upload,
  Send, MessageSquare, FileText, Info, PlayCircle, Plus,
} from 'lucide-react';

export interface TeamTasksPageProps {
  teamName: TaskTeam;
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  requests: TaskRequest[];
  setRequests: Dispatch<SetStateAction<TaskRequest[]>>;
  onNotify?: (n: { title: string; message: string; role: Role }) => void;
}

export function TeamTasksPage({ teamName, tasks, setTasks, requests, setRequests, onNotify }: TeamTasksPageProps) {
  const teamLabel = normalizeTaskTeam(teamName);
  const categories = TEAM_CATEGORIES[teamLabel] || [];
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: (categories[0] || '') as TaskCategory | '',
    assignedTo: teamLabel,
    priority: 'Medium' as Priority,
    dueDate: '',
    instructions: '',
  });
  const [selected, setSelected] = useState<Task | null>(null);
  const [progressDraft, setProgressDraft] = useState(0);
  const [progressNote, setProgressNote] = useState('');
  const [commentDraft, setCommentDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCreateForm({
      title: '',
      description: '',
      category: (TEAM_CATEGORIES[normalizeTaskTeam(teamName)]?.[0] || '') as TaskCategory | '',
      assignedTo: normalizeTaskTeam(teamName),
      priority: 'Medium',
      dueDate: '',
      instructions: '',
    });
  }, [teamName]);

  const myTasks = tasks.filter((t) => normalizeTaskTeam(t.assignedTeam) === teamLabel);
  const incomingRequests = requests.filter((request) => normalizeTaskTeam(request.assignedTeam) === teamLabel && request.status === 'Pending Acceptance');

  const filtered = myTasks.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch = t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all'
      || (statusFilter === 'Under Review'
        ? taskWorkflowStatus(t.status) === 'Submitted'
        : taskDisplayStatus(t) === statusFilter);
    return matchesSearch && matchesStatus;
  });

  const total = myTasks.length;
  const pending = myTasks.filter((t) => taskWorkflowStatus(t.status) === 'Assigned').length;
  const inProgress = myTasks.filter((t) => taskWorkflowStatus(t.status) === 'In Progress').length;
  const completed = myTasks.filter((t) => t.status === 'Completed').length;

  const updateTask = (id: string, updater: (t: Task) => Task) => {
    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;
    const updatedTask = updater(currentTask);
    setRequests((previous) => previous.map((request) => request.linkedTaskId === id
      ? { ...request, status: requestStatusFromTask(updatedTask.status) }
      : request));
    setTasks((previous) => previous.map((task) => task.id === id ? updatedTask : task));
    setSelected((previous) => previous?.id === id ? updatedTask : previous);
  };

  const handleAcceptRequest = (request: TaskRequest) => {
    if (request.status !== 'Pending Acceptance') return;
    const stamp = nowStamp();
    const nextNumber = tasks.reduce((max, task) => Math.max(max, Number(task.id.match(/(?:TASK-|T)(\d+)$/)?.[1]) || 0), 0) + 1;
    const taskId = `TASK-${String(nextNumber).padStart(3, '0')}`;
    const acceptedTask: Task = {
      id: taskId,
      title: request.title,
      description: request.description,
      assignedTeam: teamLabel,
      category: request.category,
      assignedTo: teamLabel,
      priority: request.priority,
      dueDate: request.dueDate,
      status: 'Assigned',
      createdBy: request.createdBy,
      createdAt: stamp.slice(0, 10),
      additionalInstructions: request.description,
      progress: 0,
      comments: [],
      attachments: [],
      activity: [{ id: `A${Date.now()}`, author: teamLabel, message: `Request ${request.id} accepted. Task assigned to ${teamLabel}.`, timestamp: stamp }],
    };
    setTasks((previous) => [acceptedTask, ...previous]);
    setRequests((previous) => previous.map((item) => item.id === request.id
      ? { ...item, status: 'Accepted', linkedTaskId: taskId }
      : item));
    onNotify?.({ title: 'Team Accepted Request', message: `${teamLabel} accepted "${request.title}"`, role: 'marketing-head' });
  };

  const openTask = (t: Task) => {
    setSelected(t);
    setProgressDraft(t.progress ?? 0);
    setProgressNote('');
    setCommentDraft('');
  };

  const withActivity = (t: Task, message: string): Task => ({
    ...t,
    activity: [...(t.activity || []), { id: `A${Date.now()}`, author: teamName, message, timestamp: nowStamp() }],
  });

  const handleStart = () => {
    if (!selected) return;
    updateTask(selected.id, (t) => withActivity({ ...t, status: 'In Progress' as TaskStatus, progress: Math.max(t.progress ?? 0, 5) }, 'Task started by team. Work in progress.'));
  };

  const handleCreateTask = () => {
    if (!createForm.title.trim() || !createForm.category || !createForm.assignedTo.trim() || !createForm.dueDate || !categories.includes(createForm.category)) return;
    const stamp = nowStamp();
    const nextNumber = tasks.reduce((max, task) => Math.max(max, Number(task.id.match(/(?:TASK-|T)(\d+)$/)?.[1]) || 0), 0) + 1;
    const createdTask: Task = {
      id: `TASK-${String(nextNumber).padStart(3, '0')}`,
      title: createForm.title.trim(),
      description: createForm.description.trim(),
      assignedTeam: teamLabel,
      category: createForm.category,
      assignedTo: createForm.assignedTo.trim(),
      priority: createForm.priority,
      dueDate: createForm.dueDate,
      status: 'Assigned',
      createdBy: teamLabel,
      createdAt: stamp.slice(0, 10),
      additionalInstructions: createForm.instructions.trim() || undefined,
      progress: 0,
      comments: [],
      attachments: [],
      activity: [{ id: `A${Date.now()}`, author: teamLabel, message: `Task created and assigned to ${createForm.assignedTo.trim()}.`, timestamp: stamp }],
    };
    setTasks((previous) => [createdTask, ...previous]);
    onNotify?.({ title: 'New Team Task Created', message: `${teamLabel} created "${createdTask.title}" for ${createdTask.assignedTo}`, role: 'marketing-head' });
    setCreateForm({ title: '', description: '', category: categories[0] || '', assignedTo: teamLabel, priority: 'Medium', dueDate: '', instructions: '' });
    setShowCreateTask(false);
  };

  const handleUpdateProgress = () => {
    if (!selected) return;
    const note = progressNote.trim();
    const stamp = nowStamp();
    updateTask(selected.id, (t) => ({
      ...t,
      progress: progressDraft,
      comments: note ? [...(t.comments || []), { id: `C${Date.now()}`, author: teamName, role: 'team', message: note, timestamp: stamp }] : t.comments,
      activity: [...(t.activity || []), { id: `A${Date.now()}`, author: teamName, message: `Progress updated to ${progressDraft}%`, timestamp: stamp }],
    }));
    setProgressNote('');
  };

  const handleAddComment = () => {
    if (!selected || !commentDraft.trim()) return;
    const stamp = nowStamp();
    updateTask(selected.id, (t) => ({
      ...t,
      comments: [...(t.comments || []), { id: `C${Date.now()}`, author: teamName, role: 'team', message: commentDraft.trim(), timestamp: stamp }],
    }));
    setCommentDraft('');
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !selected) return;
    const stamp = nowStamp();
    const newFiles: TaskAttachment[] = files.map((f, i) => ({
      id: `F${Date.now()}-${i}`,
      name: f.name,
      fileType: (f.name.split('.').pop() || 'FILE').toUpperCase(),
      size: f.size >= 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(f.size / 1024))} KB`,
      uploadedBy: teamName,
      uploadedAt: stamp,
    }));
    updateTask(selected.id, (t) => ({
      ...t,
      attachments: [...(t.attachments || []), ...newFiles],
      activity: [...(t.activity || []), { id: `A${Date.now()}`, author: teamName, message: `Uploaded material: ${files.map((f) => f.name).join(', ')}`, timestamp: stamp }],
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitForReview = () => {
    if (!selected) return;
    const isResubmit = taskWorkflowStatus(selected.status) === 'Changes Required';
    const stamp = nowStamp();
    updateTask(selected.id, (t) => withActivity({ ...t, status: 'Submitted' as TaskStatus, submittedAt: stamp }, isResubmit ? 'Revised work resubmitted for review after changes requested.' : 'Work completed and submitted for review.'));
    onNotify?.({
      title: isResubmit ? 'Task Resubmitted' : 'Task Submitted',
      message: `${teamName} ${isResubmit ? 'resubmitted' : 'submitted'} "${selected.title}" for Marketing Head / PRO review`,
      role: 'marketing-head',
    });
  };

  const canEdit = !!selected && ['Created', 'New', 'Assigned', 'In Progress', 'Changes Requested', 'Changes Required'].includes(selected.status);

  const columns: Column<Task>[] = [
    { key: 'title', header: 'Task', render: (row) => (
      <div>
        <span className="font-medium text-slate-700">{row.title}</span>
        {row.relatedTo && <p className="text-xs text-slate-400 mt-0.5">{row.relatedTo}</p>}
      </div>
    )},
    { key: 'category', header: 'Category', render: (row) => {
      const storedCategory = row.category as string | undefined;
      const hasGenericCategory = !storedCategory || ['general', 'generel'].includes(storedCategory.toLowerCase());
      const category = ['Digital Marketing Executive', 'Content & Brand Team', 'Events & Outreach Coordinator'].includes(teamLabel) && hasGenericCategory
        ? getTaskCategory({ ...row, category: undefined })
        : storedCategory || 'General';
      return <Badge variant="slate">{category}</Badge>;
    } },
    { key: 'createdBy', header: 'Submitted To', render: (row) => <span className="text-xs text-slate-500">{row.createdBy}</span> },
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
      <button onClick={(e) => { e.stopPropagation(); openTask(row); }} className="text-xs text-blue-600 hover:underline font-medium">
        {taskWorkflowStatus(row.status) === 'Changes Required' ? 'View Changes' : 'Open'}
      </button>
    )},
  ];

  const requestColumns: Column<TaskRequest>[] = [
    { key: 'request', header: 'Request', render: (request) => (
      <div className="max-w-sm">
        <p className="font-medium text-slate-700">{request.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{request.description}</p>
      </div>
    ) },
    { key: 'category', header: 'Category', render: (request) => <Badge variant="slate">{request.category}</Badge> },
    { key: 'priority', header: 'Priority', render: (request) => <Badge variant={request.priority === 'High' ? 'red' : request.priority === 'Medium' ? 'amber' : 'slate'}>{request.priority}</Badge> },
    { key: 'deadline', header: 'Deadline', render: (request) => <span className="text-xs text-slate-500">{request.dueDate}</span> },
    { key: 'action', header: 'Action', render: (request) => <Button size="sm" onClick={() => handleAcceptRequest(request)}>Accept Request</Button> },
  ];

  return (
    <div>
      <PageHeader
        title="Tasks"
        description={`Create tasks within ${teamLabel}'s responsibilities, then update team work and submit it for Marketing Head / PRO review.`}
        action={<Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowCreateTask(true)}>Create Task</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Tasks" value={total} icon={<ClipboardList size={20} />} accent="slate" />
        <StatCard label="New / Assigned" value={pending} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="In Progress" value={inProgress} icon={<Target size={20} />} accent="blue" />
        <StatCard label="Completed" value={completed} icon={<CheckCircle2 size={20} />} accent="green" />
      </div>

      {incomingRequests.length > 0 && (
        <Card className="mb-3">
          <CardHeader title="Incoming Requests" subtitle="Requests from the Marketing Head / PRO for your team to accept" icon={<ClipboardList size={18} />} />
          <Table columns={requestColumns} data={incomingRequests} emptyMessage="No incoming requests" />
        </Card>
      )}

      <Card>
        <CardHeader title="Team Tasks" subtitle="Create role-specific work or update tasks assigned to your team" icon={<ClipboardList size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search tasks..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={TASK_STATUSES} onChange={setStatusFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={openTask} emptyMessage="No tasks assigned yet" />
      </Card>

      <Modal
        open={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        title="Create Task"
        subtitle={`Create work for ${teamLabel}`}
        size="max-w-lg"
        footer={(
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowCreateTask(false)}>Cancel</Button>
            <Button variant="primary" icon={<Send size={16} />} onClick={handleCreateTask} disabled={!createForm.title.trim() || !createForm.category || !createForm.assignedTo.trim() || !createForm.dueDate}>Create Task</Button>
          </div>
        )}
      >
        <div className="space-y-3">
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Task Title *</span>
            <input value={createForm.title} onChange={(event) => setCreateForm({ ...createForm, title: event.target.value })} placeholder="Enter task title" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Description</span>
            <textarea value={createForm.description} onChange={(event) => setCreateForm({ ...createForm, description: event.target.value })} rows={3} placeholder="Describe the work" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-medium text-slate-500 mb-1">Task Category *</span>
              <select value={createForm.category} onChange={(event) => setCreateForm({ ...createForm, category: event.target.value as TaskCategory })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-slate-500 mb-1">Assign To *</span>
              <input value={createForm.assignedTo} onChange={(event) => setCreateForm({ ...createForm, assignedTo: event.target.value })} placeholder="Team member or team" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-medium text-slate-500 mb-1">Priority</span>
              <select value={createForm.priority} onChange={(event) => setCreateForm({ ...createForm, priority: event.target.value as Priority })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                {(['Low', 'Medium', 'High'] as Priority[]).map((priority) => <option key={priority} value={priority}>{priority}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-slate-500 mb-1">Deadline *</span>
              <input type="date" value={createForm.dueDate} onChange={(event) => setCreateForm({ ...createForm, dueDate: event.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </label>
          </div>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Instructions</span>
            <textarea value={createForm.instructions} onChange={(event) => setCreateForm({ ...createForm, instructions: event.target.value })} rows={2} placeholder="Optional instructions for the assignee" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />
          </label>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-xs text-slate-500">Status after assignment</span>
            <Badge variant={taskStatusVariant('Assigned')}>Assigned</Badge>
          </div>
        </div>
      </Modal>

      {/* Task Detail Drawer (Team side) */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Task Details"
        subtitle={selected?.title}
        footer={
          selected && (
            <div className="space-y-2">
              {['Created', 'New', 'Assigned'].includes(selected.status) && (
                <div className="flex justify-end">
                  <Button variant="primary" icon={<PlayCircle size={16} />} onClick={handleStart}>Start Task</Button>
                </div>
              )}
              {selected.status === 'In Progress' && (
                <div className="flex justify-end">
                  <Button variant="primary" icon={<Send size={16} />} onClick={handleSubmitForReview}>Submit for Review</Button>
                </div>
              )}
              {taskWorkflowStatus(selected.status) === 'Changes Required' && (
                <div className="flex justify-end">
                  <Button variant="primary" icon={<Send size={16} />} onClick={handleSubmitForReview}>Resubmit for Review</Button>
                </div>
              )}
              {taskWorkflowStatus(selected.status) === 'Submitted' && (
                <p className="text-xs text-slate-500 text-center">Submitted — awaiting review by the Marketing Head / PRO. You will be notified once a decision is made.</p>
              )}
              {selected.status === 'Completed' && (
                <p className="text-xs text-emerald-600 font-medium text-center">Task approved and completed by the Marketing Head / PRO.</p>
              )}
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge variant={taskStatusVariant(taskDisplayStatus(selected))}>{taskDisplayStatus(selected)}</Badge>
              <Badge variant={selected.priority === 'High' ? 'red' : selected.priority === 'Medium' ? 'amber' : 'slate'}>{selected.priority} Priority</Badge>
              <Badge variant="slate">Assigned to: {teamName}</Badge>
            </div>

            <div className="mb-4">
              <SectionTitle title="Workflow" />
              <TaskWorkflowStepper status={taskWorkflowStatus(selected.status)} />
            </div>

            {taskWorkflowStatus(selected.status) === 'Changes Required' && selected.reviewComments && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg mb-4">
                <p className="text-xs font-semibold text-red-700 mb-1">Changes requested by the Marketing Head / PRO</p>
                <p className="text-xs text-red-600">{selected.reviewComments}</p>
                <p className="text-[11px] text-red-500 mt-1.5">Update the work below and resubmit it for review.</p>
              </div>
            )}

            {selected.status === 'Completed' && selected.reviewComments && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg mb-4">
                <p className="text-xs font-semibold text-emerald-700 mb-1">Feedback from the Marketing Head / PRO</p>
                <p className="text-xs text-emerald-600">{selected.reviewComments}</p>
              </div>
            )}

            {taskWorkflowStatus(selected.status) === 'Submitted' && (
              <div className="flex items-start gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg mb-4">
                <Info size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-indigo-700">Your submission is with the Marketing Head / PRO for review. Task editing is locked until a decision is made.</p>
              </div>
            )}

            <InfoRow label="Task Title" value={selected.title} />
            <InfoRow label="Description" value={selected.description || '—'} />
            <InfoRow label="Task Category" value={selected.category || '—'} />
            <InfoRow label="Assigned To" value={selected.createdBy} />
            <InfoRow label="Created By" value={selected.assignedTo || teamLabel} />
            <InfoRow label="Assigned Date" value={selected.createdAt} />
            <InfoRow label="Related Campaign / Event" value={selected.relatedTo || '—'} />
            <InfoRow label="Additional Instructions" value={selected.additionalInstructions || '—'} />
            <InfoRow label="Priority" value={selected.priority} />
            <InfoRow label="Due Date" value={selected.dueDate} />
            {selected.submittedAt && <InfoRow label="Submitted On" value={selected.submittedAt} />}

            <div className="pt-3">
              <SectionTitle title="Task Progress" />
              <ProgressBar value={selected.progress ?? 0} label="Completion" color="bg-blue-500" />
              {canEdit && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                    Update Progress: <span className="font-semibold text-slate-700">{progressDraft}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={progressDraft}
                    onChange={(e) => setProgressDraft(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <input
                    type="text"
                    value={progressNote}
                    onChange={(e) => setProgressNote(e.target.value)}
                    placeholder="Add a short progress note (optional)..."
                    className="mt-2 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                  <div className="flex justify-end mt-2">
                    <Button variant="secondary" size="sm" onClick={handleUpdateProgress}>Save Progress</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3">
              <SectionTitle title="Uploaded Material">
                {canEdit && (
                  <>
                    <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />
                    <Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => fileInputRef.current?.click()}>Upload File</Button>
                  </>
                )}
              </SectionTitle>
              {selected.attachments && selected.attachments.length > 0 ? (
                <div className="space-y-2">
                  {selected.attachments.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
                        <FileText size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-700 truncate">{f.name}</p>
                        <p className="text-[11px] text-slate-400">{f.fileType} • {f.size} • {f.uploadedBy} • {f.uploadedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  No files uploaded yet.{canEdit ? ' Upload the required files/materials for this task.' : ''}
                </p>
              )}
            </div>

            <div className="pt-3">
              <SectionTitle title="Comments" />
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
              {canEdit && (
                <div className="mt-2">
                  <textarea
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    rows={2}
                    placeholder="Add a comment for the Marketing Head / PRO..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button variant="secondary" size="sm" icon={<MessageSquare size={14} />} onClick={handleAddComment} disabled={!commentDraft.trim()}>Add Comment</Button>
                  </div>
                </div>
              )}
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

