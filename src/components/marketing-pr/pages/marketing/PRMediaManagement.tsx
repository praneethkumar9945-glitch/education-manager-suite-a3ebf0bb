import { useState } from 'react';
import { Card, CardHeader, CardBody, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { Badge, statusToVariant } from '@/components/marketing-pr/components/ui/Badge';
import { Table, type Column } from '@/components/marketing-pr/components/ui/Table';
import { Drawer } from '@/components/marketing-pr/components/ui/Drawer';
import { PageHeader, SearchInput, FilterDropdown, InfoRow, Button } from '@/components/marketing-pr/components/ui/Common';
import { prActivities } from '@/components/marketing-pr/data/mockData';
import type { PRActivity } from '@/components/marketing-pr/types';
import {
  Megaphone, Newspaper, AlertCircle, CheckCircle2,
  Clock, Eye, FileText,
} from 'lucide-react';

export function PRMediaManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<PRActivity | null>(null);

  const filtered = prActivities.filter((p) => {
    const matchesSearch = p.activity.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const completed = prActivities.filter((p) => p.status === 'Completed').length;
  const inProgress = prActivities.filter((p) => p.status === 'In Progress').length;
  const pending = prActivities.filter((p) => p.status === 'Pending').length;
  const needsAttention = prActivities.filter((p) => p.status === 'Needs Attention').length;

  const columns: Column<PRActivity>[] = [
    { key: 'activity', header: 'Activity', render: (row) => <span className="font-medium text-slate-700">{row.activity}</span> },
    { key: 'type', header: 'Type', render: (row) => <Badge variant="blue">{row.type}</Badge> },
    { key: 'date', header: 'Date', render: (row) => <span className="text-slate-500">{row.date}</span> },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={statusToVariant(row.status)}>{row.status}</Badge> },
    { key: 'assigned', header: 'Assigned To', render: (row) => <span className="text-slate-500">{row.assignedTo}</span> },
  ];

  return (
    <div>
      <PageHeader title="Public Relations (PR) & Media Management" description="Manage media relations, press releases, institutional announcements, and communication with external media." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Active PR Activities" value={prActivities.length} icon={<Megaphone size={20} />} accent="blue" />
        <StatCard label="Completed" value={completed} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="Pending" value={pending + inProgress} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="Needs Attention" value={needsAttention} icon={<AlertCircle size={20} />} accent="red" />
      </div>

      {/* Items Requiring Attention */}
      {needsAttention > 0 && (
        <Card className="mb-3 border-amber-200">
          <CardHeader title="Items Requiring Attention" icon={<AlertCircle size={18} />} />
          <CardBody>
            <div className="space-y-2">
              {prActivities.filter((p) => p.status === 'Needs Attention').map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{p.activity}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.details}</p>
                  </div>
                  <Button size="sm" variant="primary" icon={<Eye size={14} />} onClick={() => setSelected(p)}>Review</Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title="PR & Media Activity Log" subtitle="All public relations and media activities" icon={<Newspaper size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search PR activities..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={['Completed', 'In Progress', 'Pending', 'Under Review', 'Needs Attention']} onChange={setStatusFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No PR activities found" />
      </Card>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="PR & Media Activity Details"
        subtitle={selected?.activity}
        footer={
          selected && (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
              {selected.status === 'Needs Attention' && <Button variant="primary" icon={<CheckCircle2 size={16} />} onClick={() => setSelected(null)}>Mark as Addressed</Button>}
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="blue">{selected.type}</Badge>
              <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            </div>
            <InfoRow label="Activity" value={selected.activity} />
            <InfoRow label="Type" value={selected.type} />
            <InfoRow label="Date" value={selected.date} />
            <InfoRow label="Status" value={selected.status} />
            <InfoRow label="Assigned To" value={selected.assignedTo} />
            <div className="pt-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Details</p>
              <p className="text-sm text-slate-600 leading-relaxed">{selected.details}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
