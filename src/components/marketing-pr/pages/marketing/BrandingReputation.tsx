import { useState } from 'react';
import { Card, CardHeader, CardBody, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { Badge, statusToVariant } from '@/components/marketing-pr/components/ui/Badge';
import { Table, type Column } from '@/components/marketing-pr/components/ui/Table';
import { Drawer, Modal } from '@/components/marketing-pr/components/ui/Drawer';
import { PageHeader, SearchInput, FilterDropdown, Button, InfoRow, EmptyState } from '@/components/marketing-pr/components/ui/Common';
import { brandActivities } from '@/components/marketing-pr/data/mockData';
import type { BrandActivity } from '@/components/marketing-pr/types';
import {
  Shield, TrendingUp, AlertCircle, Activity, CheckCircle2,
  ThumbsUp, ThumbsDown, Minus, Eye,
} from 'lucide-react';

export function BrandingReputation() {
  const [search, setSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [selected, setSelected] = useState<BrandActivity | null>(null);
  const [confirmAction, setConfirmAction] = useState<BrandActivity | null>(null);

  const filtered = brandActivities.filter((b) => {
    const matchesSearch = b.activity.toLowerCase().includes(search.toLowerCase()) || b.source.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = sentimentFilter === 'all' || b.sentiment === sentimentFilter;
    return matchesSearch && matchesFilter;
  });

  const positive = brandActivities.filter((b) => b.sentiment === 'Positive').length;
  const negative = brandActivities.filter((b) => b.sentiment === 'Negative').length;
  const needsAttention = brandActivities.filter((b) => b.status === 'Needs Attention').length;

  const columns: Column<BrandActivity>[] = [
    {
      key: 'activity', header: 'Activity',
      render: (row) => <span className="font-medium text-slate-700">{row.activity}</span>,
    },
    { key: 'source', header: 'Source', render: (row) => <span className="text-slate-500">{row.source}</span> },
    { key: 'date', header: 'Date', render: (row) => <span className="text-slate-500">{row.date}</span> },
    {
      key: 'sentiment', header: 'Sentiment/Status',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.sentiment === 'Positive' && <ThumbsUp size={14} className="text-emerald-500" />}
          {row.sentiment === 'Negative' && <ThumbsDown size={14} className="text-red-500" />}
          {row.sentiment === 'Neutral' && <Minus size={14} className="text-slate-400" />}
          <Badge variant={statusToVariant(row.status)}>{row.status}</Badge>
        </div>
      ),
    },
    {
      key: 'action', header: 'Action',
      render: (row) => (
        <button onClick={(e) => { e.stopPropagation(); setConfirmAction(row); }} className="text-xs text-blue-600 hover:underline font-medium">
          {row.status === 'Needs Attention' ? 'Review' : 'View'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Branding & Reputation Management" description="Monitor the institution's brand image, reputation, and public perception across different platforms and audiences." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Brand Status" value="Strong" icon={<Shield size={20} />} accent="green" />
        <StatCard label="Positive Mentions" value={positive} icon={<ThumbsUp size={20} />} accent="green" />
        <StatCard label="Negative Mentions" value={negative} icon={<ThumbsDown size={20} />} accent="red" />
        <StatCard label="Needs Attention" value={needsAttention} icon={<AlertCircle size={20} />} accent="amber" />
      </div>

      <Card>
        <CardHeader title="Brand Activity Log" subtitle="Recent brand mentions and activities across platforms" icon={<Activity size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search activities..." /></div>
          <FilterDropdown label="Sentiment" value={sentimentFilter} options={['Positive', 'Neutral', 'Negative']} onChange={setSentimentFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No brand activities found" />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Brand Activity Details"
        subtitle={selected?.activity}
      >
        {selected && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              {selected.sentiment === 'Positive' && <Badge variant="green"><ThumbsUp size={12} /> Positive</Badge>}
              {selected.sentiment === 'Negative' && <Badge variant="red"><ThumbsDown size={12} /> Negative</Badge>}
              {selected.sentiment === 'Neutral' && <Badge variant="slate"><Minus size={12} /> Neutral</Badge>}
              <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            </div>
            <InfoRow label="Activity" value={selected.activity} />
            <InfoRow label="Source" value={selected.source} />
            <InfoRow label="Date" value={selected.date} />
            <InfoRow label="Sentiment" value={selected.sentiment} />
            <InfoRow label="Status" value={selected.status} />
            <div className="pt-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Details</p>
              <p className="text-sm text-slate-600 leading-relaxed">{selected.details}</p>
            </div>
            {selected.status === 'Needs Attention' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-700 font-medium flex items-center gap-2"><AlertCircle size={16} /> This item requires immediate attention.</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Action Modal */}
      <Modal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title="Review Brand Activity"
        subtitle={confirmAction?.activity}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => setConfirmAction(null)} icon={<CheckCircle2 size={16} />}>Mark as Reviewed</Button>
          </div>
        }
      >
        {confirmAction && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Review the following brand activity and mark it as reviewed once addressed.</p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <InfoRow label="Source" value={confirmAction.source} />
              <InfoRow label="Date" value={confirmAction.date} />
              <InfoRow label="Sentiment" value={confirmAction.sentiment} />
              <InfoRow label="Status" value={confirmAction.status} />
            </div>
            <p className="text-sm text-slate-600">{confirmAction.details}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
