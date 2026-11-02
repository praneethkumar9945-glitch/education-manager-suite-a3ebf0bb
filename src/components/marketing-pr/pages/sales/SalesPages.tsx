import { useState } from 'react';
import { Card, CardHeader, CardBody, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { Badge, statusToVariant } from '@/components/marketing-pr/components/ui/Badge';
import { Table, type Column } from '@/components/marketing-pr/components/ui/Table';
import { Drawer, Modal } from '@/components/marketing-pr/components/ui/Drawer';
import { PageHeader, SearchInput, FilterDropdown, Button, InfoRow, SectionTitle, EmptyState } from '@/components/marketing-pr/components/ui/Common';
import { Pipeline, ProgressBar, BarChart, DonutChart } from '@/components/marketing-pr/components/charts/Charts';
import { students as initialStudents, enquiries, followUps as initialFollowUps, counsellingRecords as initialCounselling, counsellors, courses, leadSources } from '@/components/marketing-pr/data/mockData';
import type { Student, Enquiry, FollowUp, CounsellingRecord, LeadStatus } from '@/components/marketing-pr/types';
import {
  UserPlus, Phone, CalendarCheck, Target, BarChart3,
  Users, TrendingUp, CheckCircle2, Clock, AlertCircle,
  Plus, MessageSquare, Eye, GraduationCap,
} from 'lucide-react';

const leadStatuses: LeadStatus[] = ['New Lead', 'Contacted', 'Interested', 'Follow-up', 'Applied', 'Admitted'];

// ============ LEAD MANAGEMENT ============
export function LeadManagement() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selected, setSelected] = useState<Student | null>(null);
  const [assignModal, setAssignModal] = useState<Student | null>(null);
  const [statusModal, setStatusModal] = useState<Student | null>(null);
  const [followUpModal, setFollowUpModal] = useState<Student | null>(null);
  const [assignCounsellor, setAssignCounsellor] = useState('');
  const [newStatus, setNewStatus] = useState<LeadStatus>('New Lead');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');

  const filtered = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.courseInterest.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || s.leadSource === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const counts = {
    total: students.length,
    new: students.filter((s) => s.status === 'New Lead').length,
    interested: students.filter((s) => s.status === 'Interested').length,
    followups: students.filter((s) => s.status === 'Follow-up').length,
    applied: students.filter((s) => s.status === 'Applied').length,
    admitted: students.filter((s) => s.status === 'Admitted').length,
  };

  const handleAssign = () => {
    if (!assignModal || !assignCounsellor) return;
    setStudents((prev) => prev.map((s) => s.id === assignModal.id ? { ...s, assignedCounsellor: assignCounsellor } : s));
    setAssignModal(null);
    setAssignCounsellor('');
  };

  const handleStatusUpdate = () => {
    if (!statusModal) return;
    setStudents((prev) => prev.map((s) => s.id === statusModal.id ? { ...s, status: newStatus } : s));
    setStatusModal(null);
  };

  const handleFollowUp = () => {
    if (!followUpModal || !followUpDate) return;
    setStudents((prev) => prev.map((s) => s.id === followUpModal.id ? { ...s, nextFollowUp: followUpDate, notes: followUpNotes || s.notes, lastContact: new Date().toISOString().split('T')[0] } : s));
    setFollowUpModal(null);
    setFollowUpDate('');
    setFollowUpNotes('');
  };

  const columns: Column<Student>[] = [
    { key: 'name', header: 'Student', render: (row) => (
      <div>
        <span className="font-medium text-slate-700">{row.name}</span>
        <p className="text-xs text-slate-400">{row.email}</p>
      </div>
    )},
    { key: 'course', header: 'Interested Course', render: (row) => <Badge variant="blue">{row.courseInterest}</Badge> },
    { key: 'source', header: 'Lead Source', render: (row) => <span className="text-slate-500 text-xs">{row.leadSource}</span> },
    { key: 'date', header: 'Date Received', render: (row) => <span className="text-slate-500 text-xs">{row.dateReceived}</span> },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={statusToVariant(row.status)}>{row.status}</Badge> },
    { key: 'counsellor', header: 'Counsellor', render: (row) => <span className="text-slate-500 text-xs">{row.assignedCounsellor}</span> },
    { key: 'nextFollowUp', header: 'Next Follow-up', render: (row) => <span className="text-slate-500 text-xs font-medium">{row.nextFollowUp || '—'}</span> },
    { key: 'action', header: 'Action', render: (row) => (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setNewStatus(row.status); setStatusModal(row); }} className="text-xs text-emerald-600 hover:underline font-medium">Status</button>
        <button onClick={() => setFollowUpModal(row)} className="text-xs text-amber-600 hover:underline font-medium">Follow-up</button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Lead Management" description="Maintain and manage prospective student enquiries received through different marketing channels, with lead details and current status." />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mb-3">
        <StatCard label="Total Leads" value={counts.total} icon={<Users size={18} />} accent="blue" />
        <StatCard label="New Leads" value={counts.new} icon={<UserPlus size={18} />} accent="amber" />
        <StatCard label="Interested" value={counts.interested} icon={<TrendingUp size={18} />} accent="green" />
        <StatCard label="Follow-ups Due" value={counts.followups} icon={<CalendarCheck size={18} />} accent="indigo" />
        <StatCard label="Applications" value={counts.applied} icon={<CheckCircle2 size={18} />} accent="blue" />
        <StatCard label="Admissions" value={counts.admitted} icon={<GraduationCap size={18} />} accent="green" />
      </div>

      {/* Pipeline */}
      <Card className="mb-3">
        <CardHeader title="Lead Conversion Pipeline" subtitle="Movement of leads through the conversion stages" icon={<Target size={18} />} />
        <CardBody>
          <Pipeline
            steps={[
              { label: 'New Lead', count: counts.new, color: 'bg-amber-500' },
              { label: 'Contacted', count: students.filter((s) => s.status === 'Contacted').length, color: 'bg-blue-500' },
              { label: 'Interested', count: counts.interested, color: 'bg-cyan-500' },
              { label: 'Follow-up', count: counts.followups, color: 'bg-indigo-500' },
              { label: 'Applied', count: counts.applied, color: 'bg-violet-500' },
              { label: 'Admitted', count: counts.admitted, color: 'bg-emerald-500' },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Recent Leads" subtitle="All prospective student leads" icon={<UserPlus size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search by student or course..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={leadStatuses} onChange={setStatusFilter} />
          <FilterDropdown label="Source" value={sourceFilter} options={leadSources} onChange={setSourceFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No leads found" />
      </Card>

      {/* Lead Detail Drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Lead Details"
        subtitle={selected?.name}
        footer={
          selected && (
            <div className="flex justify-end gap-2 flex-wrap">
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
              <Button variant="secondary" icon={<Phone size={16} />} onClick={() => { setAssignCounsellor(selected.assignedCounsellor === 'Unassigned' ? '' : selected.assignedCounsellor); setAssignModal(selected); setSelected(null); }}>Assign</Button>
              <Button variant="primary" icon={<Target size={16} />} onClick={() => { setNewStatus(selected.status); setStatusModal(selected); setSelected(null); }}>Update Status</Button>
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
              <Badge variant={selected.interestLevel === 'High' ? 'green' : selected.interestLevel === 'Medium' ? 'amber' : 'slate'}>{selected.interestLevel} Interest</Badge>
            </div>
            <InfoRow label="Student Name" value={selected.name} />
            <InfoRow label="Email" value={selected.email} />
            <InfoRow label="Phone" value={selected.phone} />
            <InfoRow label="Interested Course" value={selected.courseInterest} />
            <InfoRow label="Lead Source" value={selected.leadSource} />
            <InfoRow label="Date Received" value={selected.dateReceived} />
            <InfoRow label="Assigned Counsellor" value={selected.assignedCounsellor} />
            <InfoRow label="Interest Level" value={selected.interestLevel} />
            {selected.lastContact && <InfoRow label="Last Contact" value={selected.lastContact} />}
            {selected.nextFollowUp && <InfoRow label="Next Follow-up" value={selected.nextFollowUp} />}
            {selected.notes && (
              <div className="pt-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Notes</p>
                <p className="text-sm text-slate-600">{selected.notes}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Assign Counsellor Modal */}
      <Modal
        open={!!assignModal}
        onClose={() => setAssignModal(null)}
        title="Assign Counsellor"
        subtitle={assignModal?.name}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setAssignModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleAssign} disabled={!assignCounsellor}>Assign</Button>
          </div>
        }
      >
        {assignModal && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Select a counsellor to assign to this lead:</p>
            <div className="space-y-2">
              {counsellors.map((c) => (
                <button
                  key={c}
                  onClick={() => setAssignCounsellor(c)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    assignCounsellor === c ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold">{c.charAt(0)}</div>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal
        open={!!statusModal}
        onClose={() => setStatusModal(null)}
        title="Update Lead Status"
        subtitle={statusModal?.name}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setStatusModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleStatusUpdate}>Update</Button>
          </div>
        }
      >
        {statusModal && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">Select new status:</p>
            {leadStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setNewStatus(s)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  newStatus === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Badge variant={statusToVariant(s)}>{s}</Badge>
              </button>
            ))}
          </div>
        )}
      </Modal>

      {/* Follow-up Modal */}
      <Modal
        open={!!followUpModal}
        onClose={() => setFollowUpModal(null)}
        title="Add Follow-up"
        subtitle={followUpModal?.name}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setFollowUpModal(null)}>Cancel</Button>
            <Button variant="primary" icon={<CalendarCheck size={16} />} onClick={handleFollowUp} disabled={!followUpDate}>Save Follow-up</Button>
          </div>
        }
      >
        {followUpModal && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Next Follow-up Date *</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Notes</label>
              <textarea
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
                rows={3}
                placeholder="Add notes about this follow-up..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============ ENQUIRY MANAGEMENT ============
export function EnquiryManagement() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [enquiryItems, setEnquiryItems] = useState<Enquiry[]>(() =>
    enquiries.map((item) => {
      const student = initialStudents.find((s) => s.name === item.studentName);
      return {
        ...item,
        phoneNumber: item.phoneNumber ?? student?.phone ?? '',
        interestedCourse: item.interestedCourse ?? student?.courseInterest ?? item.subject,
      };
    })
  );
  const [callModal, setCallModal] = useState<Enquiry | null>(null);
  const [callStatus, setCallStatus] = useState<'Completed' | 'No Answer' | 'Busy'>('Completed');
  const [callNotes, setCallNotes] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');

  const filtered = enquiryItems.filter((e) => {
    const matchesSearch = e.studentName.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || e.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleSaveInteraction = () => {
    if (!callModal) return;

    const callTimestamp = new Date().toISOString();
    const newInteraction = {
      id: `${callModal.id}-${Date.now()}`,
      callDateTime: callTimestamp,
      callStatus,
      notes: callNotes.trim(),
      nextFollowUpDate: nextFollowUpDate || undefined,
    };

    setEnquiryItems((prev) => prev.map((item) =>
      item.id === callModal.id
        ? {
            ...item,
            phoneNumber: item.phoneNumber || callModal.phoneNumber || '',
            interestedCourse: item.interestedCourse || callModal.interestedCourse || item.subject,
            callStatus,
            callNotes: callNotes.trim(),
            nextFollowUpDate: nextFollowUpDate || item.nextFollowUpDate,
            callDateTime: callTimestamp,
            activityHistory: [...(item.activityHistory ?? []), newInteraction],
          }
        : item
    ));

    setCallModal(null);
    setCallStatus('Completed');
    setCallNotes('');
    setNextFollowUpDate('');
  };

  const columns: Column<Enquiry>[] = [
    { key: 'student', header: 'Student', render: (row) => <span className="font-medium text-slate-700">{row.studentName}</span> },
    { key: 'category', header: 'Category', render: (row) => <Badge variant="blue">{row.category}</Badge> },
    { key: 'subject', header: 'Subject', render: (row) => <span className="text-slate-600 text-xs">{row.subject}</span> },
    { key: 'date', header: 'Date', render: (row) => <span className="text-slate-500 text-xs">{row.date}</span> },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={statusToVariant(row.status)}>{row.status}</Badge> },
    { key: 'counsellor', header: 'Counsellor', render: (row) => <span className="text-slate-500 text-xs">{row.assignedCounsellor}</span> },
    {
      key: 'contact',
      header: 'Contact',
      render: (row) => {
        const phone = row.phoneNumber ?? initialStudents.find((student) => student.name === row.studentName)?.phone ?? '';
        const hasPhone = Boolean(phone && phone.trim());

        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {hasPhone ? (
              <button
                type="button"
                onClick={() => {
                  setCallStatus(row.callStatus ?? 'Completed');
                  setCallNotes(row.callNotes ?? '');
                  setNextFollowUpDate(row.nextFollowUpDate ?? '');
                  setCallModal(row);
                }}
                className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Phone size={12} />
                <span>Call</span>
              </button>
            ) : (
              <>
                <button type="button" disabled className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium rounded-md border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-80">
                  <Phone size={12} />
                  <span>Call</span>
                </button>
                <span className="text-[11px] text-slate-400">No phone number</span>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader title="Enquiry Management" description="Manage student enquiries regarding courses, fees, eligibility, admissions, and other relevant information." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Enquiries" value={enquiries.length} icon={<Phone size={20} />} accent="blue" />
        <StatCard label="Open" value={enquiries.filter((e) => e.status === 'Open').length} icon={<AlertCircle size={20} />} accent="amber" />
        <StatCard label="Responded" value={enquiries.filter((e) => e.status === 'Responded').length} icon={<MessageSquare size={20} />} accent="blue" />
        <StatCard label="Closed" value={enquiries.filter((e) => e.status === 'Closed').length} icon={<CheckCircle2 size={20} />} accent="green" />
      </div>

      <Card>
        <CardHeader title="Enquiry List" subtitle="All student enquiries with status and assignment" icon={<Phone size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search enquiries..." /></div>
          <FilterDropdown label="Category" value={categoryFilter} options={['Courses', 'Fees', 'Eligibility', 'Admissions', 'Other']} onChange={setCategoryFilter} />
          <FilterDropdown label="Status" value={statusFilter} options={['Open', 'Responded', 'Closed']} onChange={setStatusFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No enquiries found" />
      </Card>

      <Modal
        open={!!callModal}
        onClose={() => setCallModal(null)}
        title="Contact Student"
        subtitle={callModal?.studentName}
        size="max-w-lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCallModal(null)}>Close</Button>
            <Button variant="primary" onClick={handleSaveInteraction}>Save Interaction</Button>
          </div>
        }
      >
        {callModal && (
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {callModal.studentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{callModal.studentName}</p>
                  <p className="text-xs text-slate-500">Student Contact</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <InfoRow label="Phone Number" value={callModal.phoneNumber || 'No phone number'} />
              <InfoRow label="Interested Course" value={callModal.interestedCourse || 'Not available'} />
              <InfoRow label="Enquiry Subject" value={callModal.subject} />
            </div>

            {callModal.phoneNumber ? (
              <a
                href={`tel:${callModal.phoneNumber}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Phone size={16} />
                Call Student
              </a>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                No phone number
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Call Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Completed', 'No Answer', 'Busy'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setCallStatus(status)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        callStatus === status
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Call Notes</label>
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  rows={3}
                  placeholder="Record what was discussed with the student..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Next Follow-up Date</label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Enquiry Details" subtitle={selected?.studentName} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Student" value={selected.studentName} />
            <InfoRow label="Category" value={selected.category} />
            <InfoRow label="Subject" value={selected.subject} />
            <InfoRow label="Date" value={selected.date} />
            <InfoRow label="Assigned Counsellor" value={selected.assignedCounsellor} />
            {selected.lastResponse && <InfoRow label="Last Response" value={selected.lastResponse} />}
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ============ FOLLOW-UPS ============
export function FollowUps() {
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<FollowUp | null>(null);
  const [updateModal, setUpdateModal] = useState<FollowUp | null>(null);
  const [updateStatus, setUpdateStatus] = useState('Due');
  const [notes, setNotes] = useState('');

  const filtered = followUps.filter((f) => {
    const matchesSearch = f.studentName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdate = () => {
    if (!updateModal) return;
    setFollowUps((prev) => prev.map((f) => f.id === updateModal.id ? { ...f, status: updateStatus as FollowUp['status'], notes: notes || f.notes } : f));
    setUpdateModal(null);
    setNotes('');
  };

  const columns: Column<FollowUp>[] = [
    { key: 'student', header: 'Student', render: (row) => <span className="font-medium text-slate-700">{row.studentName}</span> },
    { key: 'course', header: 'Interested Course', render: (row) => <Badge variant="blue">{row.courseInterest}</Badge> },
    { key: 'counsellor', header: 'Counsellor', render: (row) => <span className="text-slate-500 text-xs">{row.assignedCounsellor}</span> },
    { key: 'lastContact', header: 'Last Contact', render: (row) => <span className="text-slate-500 text-xs">{row.lastContact}</span> },
    { key: 'nextFollowUp', header: 'Next Follow-up', render: (row) => <span className="text-slate-500 text-xs font-medium">{row.nextFollowUp}</span> },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={statusToVariant(row.status)}>{row.status}</Badge> },
    { key: 'action', header: 'Action', render: (row) => (
      <button onClick={(e) => { e.stopPropagation(); setUpdateStatus(row.status); setUpdateModal(row); }} className="text-xs text-blue-600 hover:underline font-medium">Update</button>
    )},
  ];

  return (
    <div>
      <PageHeader title="Follow-ups" description="Track and manage follow-up activities with prospective students to ensure timely contact and engagement." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Due Today" value={followUps.filter((f) => f.status === 'Due').length} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="Scheduled" value={followUps.filter((f) => f.status === 'Scheduled').length} icon={<CalendarCheck size={20} />} accent="blue" />
        <StatCard label="Completed" value={followUps.filter((f) => f.status === 'Completed').length} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="Overdue" value={followUps.filter((f) => f.status === 'Overdue').length} icon={<AlertCircle size={20} />} accent="red" />
      </div>

      <Card>
        <CardHeader title="Today's Follow-ups" subtitle="All follow-up activities with status" icon={<CalendarCheck size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search by student..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={['Due', 'Scheduled', 'Completed', 'Overdue']} onChange={setStatusFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No follow-ups found" />
      </Card>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Follow-up Details" subtitle={selected?.studentName} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Student" value={selected.studentName} />
            <InfoRow label="Interested Course" value={selected.courseInterest} />
            <InfoRow label="Counsellor" value={selected.assignedCounsellor} />
            <InfoRow label="Last Contact" value={selected.lastContact} />
            <InfoRow label="Next Follow-up" value={selected.nextFollowUp} />
            {selected.notes && <InfoRow label="Notes" value={selected.notes} />}
          </div>
        )}
      </Drawer>

      <Modal
        open={!!updateModal}
        onClose={() => setUpdateModal(null)}
        title="Update Follow-up"
        subtitle={updateModal?.studentName}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setUpdateModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdate}>Update</Button>
          </div>
        }
      >
        {updateModal && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {['Due', 'Scheduled', 'Completed', 'Overdue'].map((s) => (
                  <button key={s} onClick={() => setUpdateStatus(s)} className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${updateStatus === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Add notes..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============ COUNSELLING ============
export function Counselling() {
  const [records, setRecords] = useState(initialCounselling);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<CounsellingRecord | null>(null);
  const [updateModal, setUpdateModal] = useState<CounsellingRecord | null>(null);
  const [newStatus, setNewStatus] = useState('Scheduled');

  const filtered = records.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(search.toLowerCase()) || r.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdate = () => {
    if (!updateModal) return;
    setRecords((prev) => prev.map((r) => r.id === updateModal.id ? { ...r, status: newStatus as CounsellingRecord['status'] } : r));
    setUpdateModal(null);
  };

  const columns: Column<CounsellingRecord>[] = [
    { key: 'student', header: 'Student', render: (row) => <span className="font-medium text-slate-700">{row.studentName}</span> },
    { key: 'course', header: 'Course', render: (row) => <Badge variant="blue">{row.course}</Badge> },
    { key: 'counsellor', header: 'Counsellor', render: (row) => <span className="text-slate-500 text-xs">{row.counsellor}</span> },
    { key: 'date', header: 'Date', render: (row) => <span className="text-slate-500 text-xs">{row.date}</span> },
    { key: 'interest', header: 'Interest Level', render: (row) => <Badge variant={row.interestLevel === 'High' ? 'green' : row.interestLevel === 'Medium' ? 'amber' : 'slate'}>{row.interestLevel}</Badge> },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={statusToVariant(row.status)}>{row.status}</Badge> },
    { key: 'nextStep', header: 'Next Step', render: (row) => <span className="text-slate-500 text-xs">{row.nextStep}</span> },
    { key: 'action', header: 'Action', render: (row) => (
      <button onClick={(e) => { e.stopPropagation(); setNewStatus(row.status); setUpdateModal(row); }} className="text-xs text-blue-600 hover:underline font-medium">Update</button>
    )},
  ];

  return (
    <div>
      <PageHeader title="Counselling" description="Counselling records for prospective students, including interest levels, outcomes, and next steps." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Sessions" value={records.length} icon={<GraduationCap size={20} />} accent="blue" />
        <StatCard label="Scheduled" value={records.filter((r) => r.status === 'Scheduled').length} icon={<CalendarCheck size={20} />} accent="amber" />
        <StatCard label="Completed" value={records.filter((r) => r.status === 'Completed').length} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="High Interest" value={records.filter((r) => r.interestLevel === 'High').length} icon={<TrendingUp size={20} />} accent="green" />
      </div>

      <Card>
        <CardHeader title="Counselling Records" subtitle="All counselling sessions with status and next steps" icon={<GraduationCap size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search by student or course..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={['Scheduled', 'Completed', 'Cancelled']} onChange={setStatusFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No counselling records found" />
      </Card>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Counselling Details" subtitle={selected?.studentName} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
              <Badge variant={selected.interestLevel === 'High' ? 'green' : selected.interestLevel === 'Medium' ? 'amber' : 'slate'}>{selected.interestLevel} Interest</Badge>
            </div>
            <InfoRow label="Student" value={selected.studentName} />
            <InfoRow label="Course" value={selected.course} />
            <InfoRow label="Counsellor" value={selected.counsellor} />
            <InfoRow label="Date" value={selected.date} />
            <InfoRow label="Status" value={selected.status} />
            <InfoRow label="Next Step" value={selected.nextStep} />
            {selected.notes && (
              <div className="pt-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Notes</p>
                <p className="text-sm text-slate-600">{selected.notes}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <Modal
        open={!!updateModal}
        onClose={() => setUpdateModal(null)}
        title="Update Counselling Status"
        subtitle={updateModal?.studentName}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setUpdateModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdate}>Update</Button>
          </div>
        }
      >
        {updateModal && (
          <div className="space-y-2">
            {['Scheduled', 'Completed', 'Cancelled'].map((s) => (
              <button key={s} onClick={() => setNewStatus(s)} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${newStatus === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <Badge variant={statusToVariant(s)}>{s}</Badge>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============ CONVERSION TRACKING ============
export function ConversionTracking() {
  const students = initialStudents;
  const stages: { label: string; status: LeadStatus; color: string }[] = [
    { label: 'New Lead', status: 'New Lead', color: 'bg-amber-500' },
    { label: 'Contacted', status: 'Contacted', color: 'bg-blue-500' },
    { label: 'Interested', status: 'Interested', color: 'bg-cyan-500' },
    { label: 'Follow-up', status: 'Follow-up', color: 'bg-indigo-500' },
    { label: 'Applied', status: 'Applied', color: 'bg-violet-500' },
    { label: 'Admitted', status: 'Admitted', color: 'bg-emerald-500' },
  ];

  const stageCounts = stages.map((s) => ({ ...s, count: students.filter((st) => st.status === s.status).length }));
  const totalLeads = students.length;
  const totalAdmitted = students.filter((s) => s.status === 'Admitted').length;
  const conversionRate = totalLeads > 0 ? ((totalAdmitted / totalLeads) * 100).toFixed(1) : '0';

  return (
    <div>
      <PageHeader title="Conversion Tracking" description="Track the movement of leads through the conversion pipeline from enquiry to admission." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Leads" value={totalLeads} icon={<Users size={20} />} accent="blue" />
        <StatCard label="Applied" value={students.filter((s) => s.status === 'Applied').length} icon={<CheckCircle2 size={20} />} accent="indigo" />
        <StatCard label="Admitted" value={totalAdmitted} icon={<GraduationCap size={20} />} accent="green" />
        <StatCard label="Conversion Rate" value={`${conversionRate}%`} icon={<TrendingUp size={20} />} accent="green" />
      </div>

      <Card className="mb-3">
        <CardHeader title="Conversion Pipeline" subtitle="Lead movement through all stages" icon={<Target size={18} />} />
        <CardBody>
          <Pipeline steps={stageCounts.map((s) => ({ label: s.label, count: s.count, color: s.color }))} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Conversion Rates" subtitle="Stage-to-stage conversion percentages" icon={<TrendingUp size={18} />} />
        <CardBody>
          <div className="space-y-3">
            {stageCounts.map((s, i) => {
              const prevCount = i === 0 ? totalLeads : stageCounts[i - 1].count;
              const rate = prevCount > 0 ? ((s.count / prevCount) * 100).toFixed(0) : '0';
              return (
                <div key={s.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">{s.label}</span>
                    <span className="text-sm font-medium text-slate-700">{s.count} ({rate}%)</span>
                  </div>
                  <ProgressBar value={Number(rate)} color={s.color} showValue={false} />
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// ============ SALES REPORTS ============
export function SalesReports() {
  const students = initialStudents;
  const [courseFilter, setCourseFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const filtered = students.filter((s) => {
    const matchesCourse = courseFilter === 'all' || s.courseInterest === courseFilter;
    const matchesSource = sourceFilter === 'all' || s.leadSource === sourceFilter;
    return matchesCourse && matchesSource;
  });

  const stats = {
    received: filtered.length,
    contacted: filtered.filter((s) => ['Contacted', 'Interested', 'Follow-up', 'Applied', 'Admitted'].includes(s.status)).length,
    interested: filtered.filter((s) => ['Interested', 'Follow-up', 'Applied', 'Admitted'].includes(s.status)).length,
    applied: filtered.filter((s) => ['Applied', 'Admitted'].includes(s.status)).length,
    admitted: filtered.filter((s) => s.status === 'Admitted').length,
  };
  const conversionRate = stats.received > 0 ? ((stats.admitted / stats.received) * 100).toFixed(1) : '0';

  return (
    <div>
      <PageHeader title="Sales Performance Reports" description="Comprehensive reports on leads, conversions, and sales team performance with filtering options." />

      <div className="flex gap-3 mb-3 flex-wrap">
        <FilterDropdown label="Course" value={courseFilter} options={courses} onChange={setCourseFilter} />
        <FilterDropdown label="Source" value={sourceFilter} options={leadSources} onChange={setSourceFilter} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mb-3">
        <StatCard label="Leads Received" value={stats.received} icon={<Users size={18} />} accent="blue" />
        <StatCard label="Contacted" value={stats.contacted} icon={<Phone size={18} />} accent="blue" />
        <StatCard label="Interested" value={stats.interested} icon={<TrendingUp size={18} />} accent="indigo" />
        <StatCard label="Applications" value={stats.applied} icon={<CheckCircle2 size={18} />} accent="amber" />
        <StatCard label="Admissions" value={stats.admitted} icon={<GraduationCap size={18} />} accent="green" />
        <StatCard label="Conversion Rate" value={`${conversionRate}%`} icon={<Target size={18} />} accent="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
        <Card>
          <CardHeader title="Lead Source Distribution" subtitle="Leads by marketing channel" icon={<BarChart3 size={18} />} />
          <CardBody>
            <DonutChart
              size={130}
              data={leadSources.map((src, i) => ({
                label: src,
                value: filtered.filter((s) => s.leadSource === src).length,
                color: ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-cyan-500'][i],
              }))}
              centerValue={stats.received}
              centerLabel="Total"
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Course Interest Distribution" subtitle="Leads by interested course" icon={<BarChart3 size={18} />} />
          <CardBody>
            <BarChart
              data={courses.map((c, i) => ({
                label: c.split(' ')[0],
                value: filtered.filter((s) => s.courseInterest === c).length,
                color: ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-cyan-500'][i],
              }))}
            />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Conversion Funnel" subtitle="Lead-to-Admission conversion breakdown" icon={<Target size={18} />} />
        <CardBody>
          <div className="space-y-3">
            {[
              { label: 'Leads Received', value: stats.received, color: 'bg-blue-500' },
              { label: 'Leads Contacted', value: stats.contacted, color: 'bg-cyan-500' },
              { label: 'Interested Leads', value: stats.interested, color: 'bg-indigo-500' },
              { label: 'Applications', value: stats.applied, color: 'bg-amber-500' },
              { label: 'Admissions', value: stats.admitted, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className="text-sm font-medium text-slate-700">{item.value}</span>
                </div>
                <ProgressBar value={item.value} max={stats.received} color={item.color} showValue={false} />
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">Lead-to-Admission Conversion Rate</span>
                <span className="text-lg font-bold text-emerald-600">{conversionRate}%</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
