import { useState } from 'react';
import { Card, CardHeader, CardBody, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { Badge, statusToVariant } from '@/components/marketing-pr/components/ui/Badge';
import { Table, type Column } from '@/components/marketing-pr/components/ui/Table';
import { Drawer } from '@/components/marketing-pr/components/ui/Drawer';
import { PageHeader, SearchInput, FilterDropdown, Button, InfoRow, SectionTitle } from '@/components/marketing-pr/components/ui/Common';
import { BarChart, DonutChart, ProgressBar } from '@/components/marketing-pr/components/charts/Charts';
import {
  events, schoolOutreach, partnerships, outreachLeads,
} from '@/components/marketing-pr/data/mockData';
import type { EventItem, SchoolOutreach, Partnership, OutreachLead } from '@/components/marketing-pr/types';
import {
  CalendarDays, GraduationCap, Handshake, UserPlus,
  CheckCircle2, Clock, AlertCircle, Users, MapPin, Target,
  TrendingUp, Activity,
} from 'lucide-react';

// ============ EVENT MANAGEMENT ============
export function EventManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState<EventItem | null>(null);

  const types = [...new Set(events.map((e) => e.type))];
  const filtered = events.filter((e) => {
    const ms = e.name.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'all' || e.status === statusFilter;
    const mt = typeFilter === 'all' || e.type === typeFilter;
    return ms && mf && mt;
  });

  const columns: Column<EventItem>[] = [
    { key: 'name', header: 'Event', render: (r) => <span className="font-medium text-slate-700">{r.name}</span> },
    { key: 'type', header: 'Type', render: (r) => <Badge variant="blue">{r.type}</Badge> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-slate-500 text-xs">{r.date}</span> },
    { key: 'location', header: 'Location', render: (r) => <span className="text-slate-500 text-xs">{r.location}</span> },
    { key: 'coordinator', header: 'Coordinator', render: (r) => <span className="text-slate-500 text-xs">{r.coordinator}</span> },
    { key: 'participants', header: 'Participants', render: (r) => <span className="text-slate-600 text-xs">{r.participants}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusToVariant(r.status)}>{r.status}</Badge> },
    { key: 'leads', header: 'Leads', render: (r) => <span className="font-medium text-slate-700 text-xs">{r.leadsGenerated}</span> },
  ];

  return (
    <div>
      <PageHeader title="Event Management" description="Plan and coordinate events such as education fairs, seminars, open days, workshops, and admission-related events." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Events" value={events.length} icon={<CalendarDays size={20} />} accent="blue" />
        <StatCard label="Confirmed" value={events.filter((e) => e.status === 'Confirmed').length} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="Planning" value={events.filter((e) => e.status === 'Planning').length} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="Completed" value={events.filter((e) => e.status === 'Completed').length} icon={<CheckCircle2 size={20} />} accent="indigo" />
      </div>
      <Card>
        <CardHeader title="Events" subtitle="All institutional events and activities" icon={<CalendarDays size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search events..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={['Planning', 'Confirmed', 'Completed', 'Cancelled']} onChange={setStatusFilter} />
          <FilterDropdown label="Type" value={typeFilter} options={types} onChange={setTypeFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No events found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Event Details" subtitle={selected?.name} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Event Name" value={selected.name} />
            <InfoRow label="Type" value={selected.type} />
            <InfoRow label="Date" value={selected.date} />
            <InfoRow label="Location" value={selected.location} />
            <InfoRow label="Coordinator" value={selected.coordinator} />
            <InfoRow label="Participants" value={String(selected.participants)} />
            <InfoRow label="Leads Generated" value={String(selected.leadsGenerated)} />
            <div className="pt-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Description</p>
              <p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ============ SCHOOL OUTREACH ============
export function SchoolOutreachPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<SchoolOutreach | null>(null);

  const filtered = schoolOutreach.filter((s) => {
    const ms = s.institution.toLowerCase().includes(search.toLowerCase()) || s.activity.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'all' || s.status === statusFilter;
    return ms && mf;
  });

  const columns: Column<SchoolOutreach>[] = [
    { key: 'institution', header: 'Institution', render: (r) => <span className="font-medium text-slate-700">{r.institution}</span> },
    { key: 'activity', header: 'Activity', render: (r) => <span className="text-slate-600 text-xs">{r.activity}</span> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-slate-500 text-xs">{r.date}</span> },
    { key: 'contact', header: 'Contact Person', render: (r) => <span className="text-slate-500 text-xs">{r.contactPerson}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusToVariant(r.status)}>{r.status}</Badge> },
    { key: 'leads', header: 'Leads Generated', render: (r) => <span className="font-medium text-slate-700 text-xs">{r.leadsGenerated}</span> },
  ];

  return (
    <div>
      <PageHeader title="School Outreach" description="Manage outreach activities with schools, colleges, and educational institutions to introduce programs and admission opportunities." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Outreach" value={schoolOutreach.length} icon={<GraduationCap size={20} />} accent="blue" />
        <StatCard label="Scheduled" value={schoolOutreach.filter((s) => s.status === 'Scheduled').length} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="Completed" value={schoolOutreach.filter((s) => s.status === 'Completed').length} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="Total Leads" value={schoolOutreach.reduce((s, o) => s + o.leadsGenerated, 0)} icon={<UserPlus size={20} />} accent="indigo" />
      </div>
      <Card>
        <CardHeader title="School Outreach Activities" subtitle="Outreach programs with schools and colleges" icon={<GraduationCap size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search institutions..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={['Scheduled', 'Completed', 'Pending', 'Cancelled']} onChange={setStatusFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No outreach activities found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Outreach Details" subtitle={selected?.institution} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Institution" value={selected.institution} />
            <InfoRow label="Activity" value={selected.activity} />
            <InfoRow label="Date" value={selected.date} />
            <InfoRow label="Contact Person" value={selected.contactPerson} />
            <InfoRow label="Contact Phone" value={selected.contactPhone} />
            <InfoRow label="Leads Generated" value={String(selected.leadsGenerated)} />
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ============ PARTNERSHIP & EXTERNAL COORDINATION ============
export function PartnershipCoordination() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Partnership | null>(null);

  const types = [...new Set(partnerships.map((p) => p.type))];
  const filtered = partnerships.filter((p) => {
    const ms = p.organization.toLowerCase().includes(search.toLowerCase());
    const mt = typeFilter === 'all' || p.type === typeFilter;
    const mf = statusFilter === 'all' || p.status === statusFilter;
    return ms && mt && mf;
  });

  const columns: Column<Partnership>[] = [
    { key: 'organization', header: 'Organization', render: (r) => <span className="font-medium text-slate-700">{r.organization}</span> },
    { key: 'type', header: 'Type', render: (r) => <Badge variant="blue">{r.type}</Badge> },
    { key: 'contact', header: 'Contact Person', render: (r) => <span className="text-slate-500 text-xs">{r.contactPerson}</span> },
    { key: 'collaboration', header: 'Collaboration', render: (r) => <span className="text-slate-600 text-xs">{r.collaboration}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusToVariant(r.status)}>{r.status}</Badge> },
    { key: 'date', header: 'Since', render: (r) => <span className="text-slate-500 text-xs">{r.date}</span> },
  ];

  return (
    <div>
      <PageHeader title="Partnership & External Coordination" description="Track coordination with schools, colleges, community groups, external organizations, and other relevant partners." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Partners" value={partnerships.length} icon={<Handshake size={20} />} accent="blue" />
        <StatCard label="Active" value={partnerships.filter((p) => p.status === 'Active').length} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="Proposed" value={partnerships.filter((p) => p.status === 'Proposed').length} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="On Hold" value={partnerships.filter((p) => p.status === 'On Hold').length} icon={<AlertCircle size={20} />} accent="red" />
      </div>
      <Card>
        <CardHeader title="Partnerships" subtitle="All external partnerships and collaborations" icon={<Handshake size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search organizations..." /></div>
          <FilterDropdown label="Type" value={typeFilter} options={types} onChange={setTypeFilter} />
          <FilterDropdown label="Status" value={statusFilter} options={['Active', 'Proposed', 'On Hold', 'Ended']} onChange={setStatusFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No partnerships found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Partnership Details" subtitle={selected?.organization} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Organization" value={selected.organization} />
            <InfoRow label="Type" value={selected.type} />
            <InfoRow label="Contact Person" value={selected.contactPerson} />
            <InfoRow label="Email" value={selected.email} />
            <InfoRow label="Phone" value={selected.phone} />
            <InfoRow label="Collaboration" value={selected.collaboration} />
            <InfoRow label="Partnership Since" value={selected.date} />
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ============ OUTREACH LEAD GENERATION ============
export function OutreachLeadGeneration() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<OutreachLead | null>(null);

  const filtered = outreachLeads.filter((l) => {
    const ms = l.studentName.toLowerCase().includes(search.toLowerCase()) || l.source.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'all' || l.status === statusFilter;
    return ms && mf;
  });

  const columns: Column<OutreachLead>[] = [
    { key: 'student', header: 'Student', render: (r) => <span className="font-medium text-slate-700">{r.studentName}</span> },
    { key: 'source', header: 'Event/Source', render: (r) => <Badge variant="blue">{r.source}</Badge> },
    { key: 'course', header: 'Course Interest', render: (r) => <Badge variant="slate">{r.courseInterest}</Badge> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-slate-500 text-xs">{r.date}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusToVariant(r.status)}>{r.status}</Badge> },
    { key: 'followup', header: 'Follow-up Assigned', render: (r) => <span className="text-slate-500 text-xs">{r.followUpAssigned}</span> },
  ];

  return (
    <div>
      <PageHeader title="Outreach Lead Generation" description="Record and track prospective student enquiries or leads generated through events, fairs, school visits, and outreach programs." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Leads" value={outreachLeads.length} icon={<UserPlus size={20} />} accent="blue" />
        <StatCard label="New Leads" value={outreachLeads.filter((l) => l.status === 'New Lead').length} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="Contacted" value={outreachLeads.filter((l) => l.status === 'Contacted').length} icon={<Users size={20} />} accent="blue" />
        <StatCard label="Applied" value={outreachLeads.filter((l) => l.status === 'Applied').length} icon={<CheckCircle2 size={20} />} accent="green" />
      </div>
      <Card>
        <CardHeader title="Outreach Leads" subtitle="Leads generated from events and outreach activities" icon={<UserPlus size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search leads..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={['New Lead', 'Contacted', 'Interested', 'Follow-up', 'Applied', 'Admitted']} onChange={setStatusFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No leads found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Lead Details" subtitle={selected?.studentName} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Student Name" value={selected.studentName} />
            <InfoRow label="Source" value={selected.source} />
            <InfoRow label="Course Interest" value={selected.courseInterest} />
            <InfoRow label="Date" value={selected.date} />
            <InfoRow label="Status" value={selected.status} />
            <InfoRow label="Follow-up Assigned" value={selected.followUpAssigned} />
          </div>
        )}
      </Drawer>
    </div>
  );
}
