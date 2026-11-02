import { useState } from 'react';
import { Card, CardHeader, CardBody, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { Badge, statusToVariant } from '@/components/marketing-pr/components/ui/Badge';
import { Table, type Column } from '@/components/marketing-pr/components/ui/Table';
import { Drawer, Modal } from '@/components/marketing-pr/components/ui/Drawer';
import { PageHeader, SearchInput, FilterDropdown, Button, InfoRow, SectionTitle } from '@/components/marketing-pr/components/ui/Common';
import { ProgressBar, BarChart } from '@/components/marketing-pr/components/charts/Charts';
import { campaigns as initialCampaigns } from '@/components/marketing-pr/data/mockData';
import type { Campaign } from '@/components/marketing-pr/types';
import {
  Target, TrendingUp, CheckCircle2, AlertCircle, Eye,
  Send, BarChart3,
} from 'lucide-react';

export function CampaignManagement() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<Campaign | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.objective.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const active = campaigns.filter((c) => c.status === 'Active').length;
  const completed = campaigns.filter((c) => c.status === 'Completed').length;
  const underReview = campaigns.filter((c) => c.status === 'Under Review').length;
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leadsGenerated, 0);

  const handleMarkReviewed = (id: string) => {
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, reviewed: true } : c));
    setSelected(null);
  };

  const handleSendFeedback = () => {
    if (!feedbackModal || !feedbackText.trim()) return;
    setCampaigns((prev) => prev.map((c) => c.id === feedbackModal.id ? { ...c, feedback: feedbackText, reviewed: true } : c));
    setFeedbackModal(null);
    setFeedbackText('');
  };

  const columns: Column<Campaign>[] = [
    { key: 'name', header: 'Campaign Name', render: (row) => (
      <div>
        <span className="font-medium text-slate-700">{row.name}</span>
        {row.reviewed && <CheckCircle2 size={14} className="inline-block ml-2 text-emerald-500" />}
      </div>
    )},
    { key: 'objective', header: 'Objective', render: (row) => <span className="text-slate-500 text-xs">{row.objective}</span> },
    { key: 'audience', header: 'Target Audience', render: (row) => <span className="text-slate-500 text-xs">{row.targetAudience}</span> },
    { key: 'dates', header: 'Duration', render: (row) => <span className="text-slate-500 text-xs">{row.startDate} - {row.endDate}</span> },
    { key: 'channel', header: 'Channel', render: (row) => <Badge variant="slate">{row.channel}</Badge> },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={statusToVariant(row.status)}>{row.status}</Badge> },
    { key: 'performance', header: 'Performance', render: (row) => (
      <div className="w-24">
        <ProgressBar value={row.performance} color={row.performance >= 75 ? 'bg-emerald-500' : row.performance >= 50 ? 'bg-blue-500' : 'bg-amber-500'} />
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Marketing Campaign Management" description="Plan, monitor, and evaluate promotional campaigns conducted to increase institutional awareness and attract prospective students." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Active Campaigns" value={active} icon={<Target size={20} />} accent="blue" />
        <StatCard label="Completed" value={completed} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="Under Review" value={underReview} icon={<AlertCircle size={20} />} accent="amber" />
        <StatCard label="Total Leads Generated" value={totalLeads} icon={<TrendingUp size={20} />} accent="indigo" />
      </div>

      <Card className="mb-3">
        <CardHeader title="Campaign Performance Overview" subtitle="Performance comparison across all campaigns" icon={<BarChart3 size={18} />} />
        <CardBody>
          <BarChart
            data={campaigns.filter((c) => c.status !== 'On Hold').map((c) => ({
              label: c.name.split(' ').slice(0, 2).join(' '),
              value: c.performance,
              color: c.performance >= 75 ? 'bg-emerald-500' : c.performance >= 50 ? 'bg-blue-500' : 'bg-amber-500',
            }))}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Campaign List" subtitle="All marketing campaigns with performance metrics" icon={<Target size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search campaigns..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={['Active', 'Completed', 'Under Review', 'On Hold', 'Scheduled']} onChange={setStatusFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No campaigns found" />
      </Card>

      {/* Campaign Detail Drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Campaign Details"
        subtitle={selected?.name}
        footer={
          selected && (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" icon={<Send size={16} />} onClick={() => { setFeedbackModal(selected); setSelected(null); }}>Send Feedback</Button>
              {!selected.reviewed && <Button variant="primary" icon={<CheckCircle2 size={16} />} onClick={() => handleMarkReviewed(selected.id)}>Mark as Reviewed</Button>}
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
              {selected.reviewed ? <Badge variant="green"><CheckCircle2 size={12} /> Reviewed</Badge> : <Badge variant="amber">Pending Review</Badge>}
            </div>
            <InfoRow label="Campaign Name" value={selected.name} />
            <InfoRow label="Objective" value={selected.objective} />
            <InfoRow label="Target Audience" value={selected.targetAudience} />
            <InfoRow label="Start Date" value={selected.startDate} />
            <InfoRow label="End Date" value={selected.endDate} />
            <InfoRow label="Channel" value={selected.channel} />
            <InfoRow label="Status" value={selected.status} />

            <div className="pt-3">
              <SectionTitle title="Performance Metrics" />
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">Reach</p>
                  <p className="text-lg font-bold text-slate-800">{selected.reach.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">Engagement Rate</p>
                  <p className="text-lg font-bold text-slate-800">{selected.engagement}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">Leads Generated</p>
                  <p className="text-lg font-bold text-slate-800">{selected.leadsGenerated}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">Performance Score</p>
                  <p className="text-lg font-bold text-slate-800">{selected.performance}/100</p>
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar label="Overall Performance" value={selected.performance} color={selected.performance >= 75 ? 'bg-emerald-500' : selected.performance >= 50 ? 'bg-blue-500' : 'bg-amber-500'} />
              </div>
            </div>

            {selected.feedback && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-1">Feedback Sent</p>
                <p className="text-sm text-slate-600">{selected.feedback}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Send Feedback Modal */}
      <Modal
        open={!!feedbackModal}
        onClose={() => setFeedbackModal(null)}
        title="Send Feedback / Task"
        subtitle={feedbackModal?.name}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setFeedbackModal(null)}>Cancel</Button>
            <Button variant="primary" icon={<Send size={16} />} onClick={handleSendFeedback} disabled={!feedbackText.trim()}>Send Feedback</Button>
          </div>
        }
      >
        {feedbackModal && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Send feedback or assign a task to the team responsible for this campaign.</p>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Feedback / Instructions</label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                placeholder="Enter feedback or instructions for the team..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
