import { useState } from 'react';
import { Card, CardHeader, CardBody, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { Badge, statusToVariant } from '@/components/marketing-pr/components/ui/Badge';
import { Table, type Column } from '@/components/marketing-pr/components/ui/Table';
import { Drawer } from '@/components/marketing-pr/components/ui/Drawer';
import { PageHeader, SearchInput, FilterDropdown, Button, InfoRow, SectionTitle } from '@/components/marketing-pr/components/ui/Common';
import { BarChart, DonutChart, ProgressBar } from '@/components/marketing-pr/components/charts/Charts';
import {
  digitalCampaigns, websiteContents, socialPosts, seoKeywords,
  digitalKPIs, students,
} from '@/components/marketing-pr/data/mockData';
import type { DigitalCampaign, WebsiteContent, SocialPost, SEOKeyword } from '@/components/marketing-pr/types';
import {
  Target, Globe, Megaphone, TrendingUp, BarChart3, UserPlus,
  Eye, MousePointerClick, Share2, Search, Users, Activity,
  CheckCircle2, Clock, FileText, ArrowUp, ArrowDown, Minus, Plus, Calendar, Rocket, Pencil, Send,
} from 'lucide-react';

// ============ DIGITAL CAMPAIGN MANAGEMENT ============
export function DigitalCampaignManagement() {
  const [campaigns, setCampaigns] = useState<DigitalCampaign[]>(digitalCampaigns);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [selected, setSelected] = useState<DigitalCampaign | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '', objective: '', type: 'Paid advertising', channel: 'Google Ads',
    audience: '', startDate: '', endDate: '', budget: '',
  });

  const channels = [...new Set(campaigns.map((c) => c.channel))];
  const filtered = campaigns.filter((c) => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'all' || c.status === statusFilter;
    const mc = channelFilter === 'all' || c.channel === channelFilter;
    return ms && mf && mc;
  });

  const totalReach = campaigns.reduce((s, c) => s + c.reach, 0);
  const totalLeads = campaigns.reduce((s, c) => s + c.leadsGenerated, 0);
  const active = campaigns.filter((c) => c.status === 'Active').length;

  const createCampaign = (status: DigitalCampaign['status']) => {
    const campaign: DigitalCampaign = {
      id: `DC${campaigns.length + 1}`,
      name: newCampaign.name || 'New digital campaign',
      channel: newCampaign.channel,
      startDate: newCampaign.startDate || '2026-09-16',
      endDate: newCampaign.endDate || '2026-10-16',
      status,
      reach: 0,
      engagement: 0,
      leadsGenerated: 0,
    };
    setCampaigns((items) => editingId
      ? items.map((item) => item.id === editingId ? { ...item, name: campaign.name, channel: campaign.channel, startDate: campaign.startDate, endDate: campaign.endDate, status: campaign.status } : item)
      : [...items, campaign]);
    setCreateOpen(false);
    setEditingId(null);
    setNewCampaign({ name: '', objective: '', type: 'Paid advertising', channel: 'Google Ads', audience: '', startDate: '', endDate: '', budget: '' });
  };

  const columns: Column<DigitalCampaign>[] = [
    { key: 'name', header: 'Campaign', render: (r) => <span className="font-medium text-slate-700">{r.name}</span> },
    { key: 'channel', header: 'Channel', render: (r) => <Badge variant="blue">{r.channel}</Badge> },
    { key: 'start', header: 'Start Date', render: (r) => <span className="text-slate-500 text-xs">{r.startDate}</span> },
    { key: 'end', header: 'End Date', render: (r) => <span className="text-slate-500 text-xs">{r.endDate}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusToVariant(r.status)}>{r.status}</Badge> },
    { key: 'reach', header: 'Reach', render: (r) => <span className="text-slate-600 text-xs">{r.reach.toLocaleString()}</span> },
    { key: 'engagement', header: 'Engagement', render: (r) => <span className="text-slate-600 text-xs">{r.engagement}%</span> },
    { key: 'leads', header: 'Leads', render: (r) => <span className="font-medium text-slate-700 text-xs">{r.leadsGenerated}</span> },
  ];

  return (
    <div>
      <PageHeader title="Digital Campaign Management" description="Plan, launch, and monitor online marketing campaigns for courses, admissions, events, and institutional activities." action={<Button icon={<Plus size={16} />} onClick={() => { setEditingId(null); setCreateOpen(true); }}>Create Campaign</Button>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Active Campaigns" value={active} icon={<Target size={20} />} accent="blue" />
        <StatCard label="Total Reach" value={totalReach.toLocaleString()} icon={<Eye size={20} />} accent="green" />
        <StatCard label="Total Leads" value={totalLeads} icon={<UserPlus size={20} />} accent="indigo" />
        <StatCard label="Avg Engagement" value="7.7%" icon={<Activity size={20} />} accent="amber" />
      </div>
      <Card className="mb-3">
        <CardHeader title="Campaign Performance" subtitle="Leads generated by channel" icon={<BarChart3 size={18} />} />
        <CardBody>
          <BarChart data={campaigns.map((c) => ({ label: c.channel, value: c.leadsGenerated, color: 'bg-cyan-500' }))} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Digital Campaigns" subtitle="All online marketing campaigns" icon={<Target size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search campaigns..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={['Active', 'Completed', 'On Hold']} onChange={setStatusFilter} />
          <FilterDropdown label="Channel" value={channelFilter} options={channels} onChange={setChannelFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No campaigns found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Campaign Details" subtitle={selected?.name} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Campaign" value={selected.name} />
            <InfoRow label="Channel" value={selected.channel} />
            <InfoRow label="Start Date" value={selected.startDate} />
            <InfoRow label="End Date" value={selected.endDate} />
            <InfoRow label="Reach" value={selected.reach.toLocaleString()} />
            <InfoRow label="Engagement Rate" value={`${selected.engagement}%`} />
            <InfoRow label="Leads Generated" value={String(selected.leadsGenerated)} />
            <div className="pt-4">
              <Button icon={<Pencil size={14} />} onClick={() => {
                setEditingId(selected.id);
                setNewCampaign({ name: selected.name, objective: '', type: 'Paid advertising', channel: selected.channel, audience: '', startDate: selected.startDate, endDate: selected.endDate, budget: '' });
                setSelected(null);
                setCreateOpen(true);
              }}>Edit Campaign</Button>
            </div>
          </div>
        )}
      </Drawer>
      <Drawer open={createOpen} onClose={() => { setCreateOpen(false); setEditingId(null); }} title={editingId ? 'Edit Campaign' : 'Create Campaign'} subtitle="Set up, schedule, or launch a digital campaign" footer={<Button variant="secondary" onClick={() => { setCreateOpen(false); setEditingId(null); }}>Cancel</Button>}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['name', 'Campaign name', 'text'], ['objective', 'Campaign objective', 'text'],
              ['audience', 'Target audience', 'text'], ['budget', 'Budget', 'text'],
              ['startDate', 'Start date', 'date'], ['endDate', 'End date', 'date'],
            ].map(([key, label, type]) => (
              <label key={key} className="text-xs font-medium text-slate-500">
                {label}
                <input type={type} value={newCampaign[key as keyof typeof newCampaign]} onChange={(event) => setNewCampaign({ ...newCampaign, [key!]: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </label>
            ))}
            <label className="text-xs font-medium text-slate-500">Campaign type<select value={newCampaign.type} onChange={(event) => setNewCampaign({ ...newCampaign, type: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"><option>Paid advertising</option><option>Promotional campaign</option><option>Organic campaign</option></select></label>
            <label className="text-xs font-medium text-slate-500">Channel<select value={newCampaign.channel} onChange={(event) => setNewCampaign({ ...newCampaign, channel: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"><option>Google Ads</option><option>Instagram</option><option>Facebook</option><option>LinkedIn</option><option>Email</option><option>Multi-channel</option></select></label>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <Button variant="secondary" icon={<FileText size={14} />} onClick={() => createCampaign('Draft')}>Save Draft</Button>
            <Button variant="secondary" icon={<Calendar size={14} />} onClick={() => createCampaign('Scheduled')}>Schedule Campaign</Button>
            <Button icon={<Rocket size={14} />} onClick={() => createCampaign('Active')}>Launch Campaign</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

// ============ WEBSITE MANAGEMENT ============
export function WebsiteManagement() {
  const [pages, setPages] = useState<WebsiteContent[]>(websiteContents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState<WebsiteContent | null>(null);
  const [addPageOpen, setAddPageOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [newPage, setNewPage] = useState({ title: '', type: 'Courses' as WebsiteContent['type'], url: '', lastUpdated: '2026-09-16' });

  const types = [...new Set(pages.map((w) => w.type))];
  const filtered = pages.filter((w) => {
    const ms = w.title.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'all' || w.status === statusFilter;
    const mt = typeFilter === 'all' || w.type === typeFilter;
    return ms && mf && mt;
  });

  const addPage = (status: WebsiteContent['status']) => {
    const page: WebsiteContent = {
      id: `W${pages.length + 1}`,
      title: newPage.title || 'New website page',
      type: newPage.type,
      status,
      lastUpdated: newPage.lastUpdated,
      url: newPage.url || '/new-page',
      views: 0,
    };
    setPages((items) => editingPageId
      ? items.map((item) => item.id === editingPageId ? { ...item, ...page, id: item.id } : item)
      : [...items, page]);
    setAddPageOpen(false);
    setEditingPageId(null);
    setNewPage({ title: '', type: 'Courses', url: '', lastUpdated: '2026-09-16' });
  };

  const submitPageForReview = () => {
    if (!selected) return;
    const updatedPage = { ...selected, status: 'Under Review' as const, lastUpdated: '2026-09-16' };
    setPages((items) => items.map((item) => item.id === selected.id ? updatedPage : item));
    setSelected(updatedPage);
  };

  const columns: Column<WebsiteContent>[] = [
    { key: 'title', header: 'Title', render: (r) => <span className="font-medium text-slate-700">{r.title}</span> },
    { key: 'type', header: 'Type', render: (r) => <Badge variant="blue">{r.type}</Badge> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusToVariant(r.status)}>{r.status}</Badge> },
    { key: 'updated', header: 'Last Updated', render: (r) => <span className="text-slate-500 text-xs">{r.lastUpdated}</span> },
    { key: 'views', header: 'Views', render: (r) => <span className="text-slate-600 text-xs">{r.views.toLocaleString()}</span> },
  ];

  return (
    <div>
      <PageHeader title="Website Management" description="Manage and update website content related to courses, admissions, events, announcements, and other promotional information." action={<Button icon={<Plus size={16} />} onClick={() => { setEditingPageId(null); setAddPageOpen(true); }}>Add Page</Button>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Pages" value={pages.length} icon={<Globe size={20} />} accent="blue" />
        <StatCard label="Published" value={pages.filter((w) => w.status === 'Published').length} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="Under Review" value={pages.filter((w) => w.status === 'Under Review').length} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="Draft" value={pages.filter((w) => w.status === 'Draft').length} icon={<FileText size={20} />} accent="slate" />
      </div>
      <Card>
        <CardHeader title="Website Content" subtitle="All website pages and promotional content" icon={<Globe size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search content..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={['Draft', 'Under Review', 'Published']} onChange={setStatusFilter} />
          <FilterDropdown label="Type" value={typeFilter} options={types} onChange={setTypeFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No content found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Content Details" subtitle={selected?.title} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Title" value={selected.title} />
            <InfoRow label="Type" value={selected.type} />
            <InfoRow label="URL" value={selected.url} />
            <InfoRow label="Last Updated" value={selected.lastUpdated} />
            <InfoRow label="Views" value={selected.views.toLocaleString()} />
            <div className="flex flex-wrap gap-2 pt-4">
              <Button variant="secondary" icon={<Pencil size={14} />} onClick={() => {
                setEditingPageId(selected.id);
                setNewPage({ title: selected.title, type: selected.type, url: selected.url, lastUpdated: selected.lastUpdated });
                setSelected(null);
                setAddPageOpen(true);
              }}>Edit</Button>
              {selected.status !== 'Under Review' && <Button icon={<Send size={14} />} onClick={submitPageForReview}>Submit for Review</Button>}
            </div>
          </div>
        )}
      </Drawer>
      <Drawer open={addPageOpen} onClose={() => { setAddPageOpen(false); setEditingPageId(null); }} title={editingPageId ? 'Edit Website Page' : 'Add Website Page'} subtitle="Update content or submit the new page for review" footer={<Button variant="secondary" onClick={() => { setAddPageOpen(false); setEditingPageId(null); }}>Cancel</Button>}>
        <div className="space-y-4">
          <label className="block text-xs font-medium text-slate-500">Page title<input type="text" value={newPage.title} onChange={(event) => setNewPage({ ...newPage, title: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></label>
          <label className="block text-xs font-medium text-slate-500">Page type<select value={newPage.type} onChange={(event) => setNewPage({ ...newPage, type: event.target.value as WebsiteContent['type'] })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"><option>Courses</option><option>Admissions</option><option>Events</option><option>Announcements</option></select></label>
          <label className="block text-xs font-medium text-slate-500">Page URL<input type="text" value={newPage.url} onChange={(event) => setNewPage({ ...newPage, url: event.target.value })} placeholder="/page-url" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></label>
          <label className="block text-xs font-medium text-slate-500">Content update<textarea rows={5} placeholder="Enter page content or update notes" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></label>
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4"><Button variant="secondary" icon={<FileText size={14} />} onClick={() => addPage('Draft')}>Update</Button><Button icon={<Send size={14} />} onClick={() => addPage('Under Review')}>Submit for Review</Button></div>
        </div>
      </Drawer>
    </div>
  );
}

// ============ SOCIAL MEDIA MANAGEMENT ============
export function SocialMediaManagement() {
  const [posts, setPosts] = useState<(SocialPost & { status: 'Draft' | 'Scheduled' | 'Published' })[]>(socialPosts.map((post) => ({ ...post, status: 'Published' })));
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selected, setSelected] = useState<(SocialPost & { status: 'Draft' | 'Scheduled' | 'Published' }) | null>(null);
  const [postEditorOpen, setPostEditorOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postDraft, setPostDraft] = useState({ platform: 'Instagram' as SocialPost['platform'], content: '', date: '2026-09-16' });

  const platforms = [...new Set(posts.map((p) => p.platform))];
  const filtered = posts.filter((p) => {
    const ms = p.content.toLowerCase().includes(search.toLowerCase());
    const mp = platformFilter === 'all' || p.platform === platformFilter;
    return ms && mp;
  });

  const totalReach = posts.reduce((s, p) => s + p.reach, 0);
  const totalEngagement = posts.reduce((s, p) => s + p.likes + p.comments + p.shares, 0);

  const savePost = (status: 'Draft' | 'Scheduled' | 'Published') => {
    const post = { id: editingPostId || `SP${posts.length + 1}`, platform: postDraft.platform, content: postDraft.content || 'New social media post', date: postDraft.date, status, reach: 0, engagement: 0, likes: 0, comments: 0, shares: 0 };
    setPosts((items) => editingPostId ? items.map((item) => item.id === editingPostId ? { ...item, ...post } : item) : [...items, post]);
    setPostEditorOpen(false);
    setEditingPostId(null);
    setPostDraft({ platform: 'Instagram', content: '', date: '2026-09-16' });
  };

  const publishPost = () => {
    if (!selected) return;
    const published = { ...selected, status: 'Published' as const };
    setPosts((items) => items.map((item) => item.id === selected.id ? published : item));
    setSelected(published);
  };

  const columns: Column<typeof posts[number]>[] = [
    { key: 'platform', header: 'Platform', render: (r) => <Badge variant="blue">{r.platform}</Badge> },
    { key: 'content', header: 'Content', render: (r) => <span className="text-slate-600 text-xs line-clamp-1">{r.content}</span> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-slate-500 text-xs">{r.date}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusToVariant(r.status)}>{r.status}</Badge> },
    { key: 'reach', header: 'Reach', render: (r) => <span className="text-slate-600 text-xs">{r.reach.toLocaleString()}</span> },
    { key: 'engagement', header: 'Engagement', render: (r) => <span className="text-slate-600 text-xs">{r.engagement}%</span> },
    { key: 'likes', header: 'Likes', render: (r) => <span className="text-slate-600 text-xs">{r.likes}</span> },
    { key: 'comments', header: 'Comments', render: (r) => <span className="text-slate-600 text-xs">{r.comments}</span> },
    { key: 'shares', header: 'Shares', render: (r) => <span className="text-slate-600 text-xs">{r.shares}</span> },
  ];

  return (
    <div>
      <PageHeader title="Social Media Management" description="Manage the institution's social media presence, including posts, updates, engagement, and audience reach." action={<Button icon={<Plus size={16} />} onClick={() => { setEditingPostId(null); setPostDraft({ platform: 'Instagram', content: '', date: '2026-09-16' }); setPostEditorOpen(true); }}>Create Post</Button>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Posts" value={socialPosts.length} icon={<Megaphone size={20} />} accent="blue" />
        <StatCard label="Total Reach" value={totalReach.toLocaleString()} icon={<Share2 size={20} />} accent="green" />
        <StatCard label="Total Engagement" value={totalEngagement.toLocaleString()} icon={<Activity size={20} />} accent="indigo" />
        <StatCard label="Platforms" value={platforms.length} icon={<Globe size={20} />} accent="amber" />
      </div>
      <Card className="mb-3">
        <CardHeader title="Reach by Platform" subtitle="Audience reach distribution" icon={<BarChart3 size={18} />} />
        <CardBody>
          <DonutChart size={130} data={platforms.map((p, i) => ({
            label: p, value: posts.filter((sp) => sp.platform === p).reduce((s, sp) => s + sp.reach, 0),
            color: ['bg-pink-500', 'bg-blue-600', 'bg-blue-700', 'bg-slate-700'][i] ?? 'bg-slate-500',
          }))} centerValue={`${(totalReach / 1000).toFixed(1)}K`} centerLabel="Reach" />
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Social Media Activity" subtitle="All social media posts and performance" icon={<Megaphone size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search posts..." /></div>
          <FilterDropdown label="Platform" value={platformFilter} options={platforms} onChange={setPlatformFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No posts found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Post Details" subtitle={selected?.platform} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant="blue">{selected.platform}</Badge>
            <InfoRow label="Content" value={selected.content} />
            <InfoRow label="Date" value={selected.date} />
            <InfoRow label="Status" value={selected.status} />
            <InfoRow label="Reach" value={selected.reach.toLocaleString()} />
            <InfoRow label="Engagement Rate" value={`${selected.engagement}%`} />
            <InfoRow label="Likes" value={String(selected.likes)} />
            <InfoRow label="Comments" value={String(selected.comments)} />
            <InfoRow label="Shares" value={String(selected.shares)} />
            <div className="flex flex-wrap gap-2 pt-4">
              <Button variant="secondary" icon={<Pencil size={14} />} onClick={() => { setEditingPostId(selected.id); setPostDraft({ platform: selected.platform, content: selected.content, date: selected.date }); setSelected(null); setPostEditorOpen(true); }}>Edit</Button>
              {selected.status !== 'Published' && <Button icon={<Send size={14} />} onClick={publishPost}>Publish</Button>}
            </div>
          </div>
        )}
      </Drawer>
      <Drawer open={postEditorOpen} onClose={() => { setPostEditorOpen(false); setEditingPostId(null); }} title={editingPostId ? 'Edit Post' : 'Create Post'} subtitle="Create, schedule, or publish a social media post" footer={<Button variant="secondary" onClick={() => { setPostEditorOpen(false); setEditingPostId(null); }}>Cancel</Button>}>
        <div className="space-y-4">
          <label className="block text-xs font-medium text-slate-500">Platform<select value={postDraft.platform} onChange={(event) => setPostDraft({ ...postDraft, platform: event.target.value as SocialPost['platform'] })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"><option>Instagram</option><option>Facebook</option><option>LinkedIn</option><option>Twitter</option></select></label>
          <label className="block text-xs font-medium text-slate-500">Post content<textarea rows={5} value={postDraft.content} onChange={(event) => setPostDraft({ ...postDraft, content: event.target.value })} placeholder="Write your post content" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></label>
          <label className="block text-xs font-medium text-slate-500">Post date<input type="date" value={postDraft.date} onChange={(event) => setPostDraft({ ...postDraft, date: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></label>
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4"><Button variant="secondary" icon={<Calendar size={14} />} onClick={() => savePost('Scheduled')}>Schedule</Button><Button icon={<Send size={14} />} onClick={() => savePost('Published')}>Publish</Button></div>
        </div>
      </Drawer>
    </div>
  );
}

// ============ SEO MANAGEMENT ============
export function SEOManagement() {
  const [keywords, setKeywords] = useState<SEOKeyword[]>(seoKeywords);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SEOKeyword | null>(null);
  const [keywordEditorOpen, setKeywordEditorOpen] = useState(false);
  const [monitoredKeywords, setMonitoredKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState({ keyword: '', rank: '0', previousRank: '0', searchVolume: '0', trend: 'stable' as SEOKeyword['trend'] });

  const filtered = keywords.filter((k) => k.keyword.toLowerCase().includes(search.toLowerCase()));

  const updateSEO = () => {
    const keyword: SEOKeyword = {
      id: `K${keywords.length + 1}`,
      keyword: newKeyword.keyword || 'new SEO keyword',
      rank: Number(newKeyword.rank) || 0,
      previousRank: Number(newKeyword.previousRank) || 0,
      searchVolume: Number(newKeyword.searchVolume) || 0,
      trend: newKeyword.trend,
    };
    setKeywords((items) => [...items, keyword]);
    setKeywordEditorOpen(false);
    setNewKeyword({ keyword: '', rank: '0', previousRank: '0', searchVolume: '0', trend: 'stable' });
  };

  const toggleMonitoring = () => {
    if (!selected) return;
    setMonitoredKeywords((items) => items.includes(selected.id) ? items.filter((id) => id !== selected.id) : [...items, selected.id]);
  };

  const columns: Column<SEOKeyword>[] = [
    { key: 'keyword', header: 'Keyword', render: (r) => <span className="font-medium text-slate-700">{r.keyword}</span> },
    { key: 'rank', header: 'Current Rank', render: (r) => <span className="font-bold text-slate-800">#{r.rank}</span> },
    { key: 'prev', header: 'Previous Rank', render: (r) => <span className="text-slate-500 text-xs">#{r.previousRank}</span> },
    { key: 'change', header: 'Change', render: (r) => {
      const diff = r.previousRank - r.rank;
      return (
        <span className={`flex items-center gap-1 text-xs font-medium ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-500' : 'text-slate-400'}`}>
          {diff > 0 && <ArrowUp size={14} />}
          {diff < 0 && <ArrowDown size={14} />}
          {diff === 0 && <Minus size={14} />}
          {diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : 'No change'}
        </span>
      );
    }},
    { key: 'volume', header: 'Search Volume', render: (r) => <span className="text-slate-600 text-xs">{r.searchVolume.toLocaleString()}</span> },
    { key: 'trend', header: 'Trend', render: (r) => (
      <Badge variant={r.trend === 'up' ? 'green' : r.trend === 'down' ? 'red' : 'slate'}>
        {r.trend === 'up' ? 'Improving' : r.trend === 'down' ? 'Declining' : 'Stable'}
      </Badge>
    )},
  ];

  return (
    <div>
      <PageHeader title="SEO Management" description="Improve the institution's visibility in search engines by monitoring keywords, website performance, and search rankings." action={<Button icon={<Plus size={16} />} onClick={() => setKeywordEditorOpen(true)}>Add Keyword</Button>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Tracked Keywords" value={keywords.length} icon={<Search size={20} />} accent="blue" />
        <StatCard label="Top 10 Rankings" value={keywords.filter((k) => k.rank <= 10).length} icon={<TrendingUp size={20} />} accent="green" />
        <StatCard label="Improving" value={keywords.filter((k) => k.trend === 'up').length} icon={<ArrowUp size={20} />} accent="green" />
        <StatCard label="Declining" value={keywords.filter((k) => k.trend === 'down').length} icon={<ArrowDown size={20} />} accent="red" />
      </div>
      <Card className="mb-3">
        <CardHeader title="Keyword Rankings" subtitle="Current vs previous search rankings" icon={<BarChart3 size={18} />} />
        <CardBody>
          <BarChart data={keywords.map((k) => ({ label: k.keyword.split(' ').slice(0, 2).join(' '), value: k.rank, color: k.trend === 'up' ? 'bg-emerald-500' : k.trend === 'down' ? 'bg-red-400' : 'bg-slate-400' }))} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="SEO Keywords" subtitle="All tracked keywords with rankings" icon={<Search size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="w-full max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search keywords..." /></div>
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No keywords found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Keyword Details" subtitle={selected?.keyword} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={selected.trend === 'up' ? 'green' : selected.trend === 'down' ? 'red' : 'slate'}>
              {selected.trend === 'up' ? 'Improving' : selected.trend === 'down' ? 'Declining' : 'Stable'}
            </Badge>
            <InfoRow label="Keyword" value={selected.keyword} />
            <InfoRow label="Current Rank" value={`#${selected.rank}`} />
            <InfoRow label="Previous Rank" value={`#${selected.previousRank}`} />
            <InfoRow label="Search Volume" value={selected.searchVolume.toLocaleString()} />
            <div className="pt-4"><Button icon={<TrendingUp size={14} />} variant={monitoredKeywords.includes(selected.id) ? 'success' : 'primary'} onClick={toggleMonitoring}>{monitoredKeywords.includes(selected.id) ? 'Monitoring Ranking' : 'Monitor Ranking'}</Button></div>
          </div>
        )}
      </Drawer>
      <Drawer open={keywordEditorOpen} onClose={() => setKeywordEditorOpen(false)} title="Add Keyword" subtitle="Update SEO keyword tracking data" footer={<Button variant="secondary" onClick={() => setKeywordEditorOpen(false)}>Cancel</Button>}>
        <div className="space-y-4">
          <label className="block text-xs font-medium text-slate-500">Keyword<input type="text" value={newKeyword.keyword} onChange={(event) => setNewKeyword({ ...newKeyword, keyword: event.target.value })} placeholder="e.g. best college admissions" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{[['rank', 'Current rank'], ['previousRank', 'Previous rank'], ['searchVolume', 'Search volume']].map(([key, label]) => <label key={key} className="text-xs font-medium text-slate-500">{label}<input type="number" min="0" value={newKeyword[key as keyof typeof newKeyword]} onChange={(event) => setNewKeyword({ ...newKeyword, [key as keyof typeof newKeyword]: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700" /></label>)}</div>
          <label className="block text-xs font-medium text-slate-500">Trend<select value={newKeyword.trend} onChange={(event) => setNewKeyword({ ...newKeyword, trend: event.target.value as SEOKeyword['trend'] })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"><option value="up">Improving</option><option value="stable">Stable</option><option value="down">Declining</option></select></label>
          <div className="border-t border-slate-100 pt-4"><Button icon={<FileText size={14} />} onClick={updateSEO}>Update SEO</Button></div>
        </div>
      </Drawer>
    </div>
  );
}

// ============ DIGITAL ANALYTICS & REPORTS ============
export function DigitalAnalytics() {
  const leadsByChannel = [
    { label: 'Google Ads', value: 145, color: 'bg-blue-500' },
    { label: 'Instagram', value: 92, color: 'bg-pink-500' },
    { label: 'LinkedIn', value: 67, color: 'bg-blue-700' },
    { label: 'Facebook', value: 84, color: 'bg-blue-600' },
    { label: 'YouTube', value: 51, color: 'bg-red-500' },
    { label: 'Email', value: 38, color: 'bg-amber-500' },
  ];
  const totalLeadsByChannel = leadsByChannel.reduce((total, channel) => total + channel.value, 0);

  return (
    <div>
      <PageHeader title="Digital Analytics & Reports" description="Track website traffic, social media engagement, campaign performance, leads generated, and other digital marketing KPIs." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        {digitalKPIs.slice(0, 8).map((kpi, i) => (
          <StatCard
            key={i}
            label={kpi.label}
            value={kpi.value}
            icon={i < 2 ? <Eye size={20} /> : i < 4 ? <Share2 size={20} /> : i < 6 ? <Search size={20} /> : <MousePointerClick size={20} />}
            accent={i < 2 ? 'blue' : i < 4 ? 'green' : i < 6 ? 'amber' : 'indigo'}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
        <Card>
          <CardHeader title="Website Traffic (Weekly)" subtitle="Daily visitor trends" icon={<Globe size={18} />} />
          <CardBody>
            <BarChart data={[
              { label: 'Mon', value: 6200 }, { label: 'Tue', value: 7100 }, { label: 'Wed', value: 8400 },
              { label: 'Thu', value: 7800 }, { label: 'Fri', value: 9200 }, { label: 'Sat', value: 4800 }, { label: 'Sun', value: 4750 },
            ]} color="bg-blue-500" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Leads by Channel" subtitle="Digital lead generation breakdown" icon={<UserPlus size={18} />} />
          <CardBody>
            <DonutChart size={130} data={leadsByChannel} centerValue={totalLeadsByChannel} centerLabel="Leads" />
          </CardBody>
        </Card>
      </div>
      <Card>
        <CardHeader title="Digital KPI Summary" subtitle="Key performance indicators across all digital channels" icon={<BarChart3 size={18} />} />
        <CardBody>
          <div className="space-y-3">
            {digitalKPIs.map((kpi, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-600">{kpi.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-800">{kpi.value}</span>
                    <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.trend === 'up' ? 'text-emerald-600' : kpi.trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                      {kpi.trend === 'up' && <ArrowUp size={12} />}
                      {kpi.trend === 'down' && <ArrowDown size={12} />}
                      {kpi.trend === 'stable' && <Minus size={12} />}
                      {kpi.change > 0 ? `+${kpi.change}%` : `${kpi.change}%`}
                    </span>
                  </div>
                </div>
                <ProgressBar value={Math.abs(kpi.change)} max={20} color={kpi.trend === 'up' ? 'bg-emerald-500' : kpi.trend === 'down' ? 'bg-red-400' : 'bg-slate-300'} showValue={false} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// ============ LEAD GENERATION ============
export function LeadGeneration() {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selected, setSelected] = useState<typeof digitalLeads[0] | null>(null);

  const digitalLeads = students.filter((s) => ['Website', 'Social Media'].includes(s.leadSource));

  const filtered = digitalLeads.filter((l) => {
    const ms = l.name.toLowerCase().includes(search.toLowerCase());
    const mf = sourceFilter === 'all' || l.leadSource === sourceFilter;
    return ms && mf;
  });

  const columns: Column<typeof digitalLeads[0]>[] = [
    { key: 'name', header: 'Student', render: (r) => <span className="font-medium text-slate-700">{r.name}</span> },
    { key: 'source', header: 'Source', render: (r) => <Badge variant="blue">{r.leadSource}</Badge> },
    { key: 'course', header: 'Course Interest', render: (r) => <Badge variant="slate">{r.courseInterest}</Badge> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-slate-500 text-xs">{r.dateReceived}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusToVariant(r.status)}>{r.status}</Badge> },
    { key: 'counsellor', header: 'Assigned To', render: (r) => <span className="text-slate-500 text-xs">{r.assignedCounsellor}</span> },
  ];

  return (
    <div>
      <PageHeader title="Lead Generation" description="View leads generated through digital campaigns, social media, website forms, and online advertisements, with source and campaign attribution." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Digital Leads" value={digitalLeads.length} icon={<UserPlus size={20} />} accent="blue" />
        <StatCard label="From Website" value={digitalLeads.filter((l) => l.leadSource === 'Website').length} icon={<Globe size={20} />} accent="green" />
        <StatCard label="From Social Media" value={digitalLeads.filter((l) => l.leadSource === 'Social Media').length} icon={<Share2 size={20} />} accent="indigo" />
        <StatCard label="New Leads" value={digitalLeads.filter((l) => l.status === 'New Lead').length} icon={<Clock size={20} />} accent="amber" />
      </div>
      <Card>
        <CardHeader title="Digital Leads" subtitle="Leads generated through digital channels" icon={<UserPlus size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search leads..." /></div>
          <FilterDropdown label="Source" value={sourceFilter} options={['Website', 'Social Media']} onChange={setSourceFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No leads found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Lead Details" subtitle={selected?.name} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Student Name" value={selected.name} />
            <InfoRow label="Email" value={selected.email} />
            <InfoRow label="Phone" value={selected.phone} />
            <InfoRow label="Lead Source" value={selected.leadSource} />
            <InfoRow label="Course Interest" value={selected.courseInterest} />
            <InfoRow label="Date Received" value={selected.dateReceived} />
            <InfoRow label="Assigned Counsellor" value={selected.assignedCounsellor} />
            <InfoRow label="Interest Level" value={selected.interestLevel} />
          </div>
        )}
      </Drawer>
    </div>
  );
}
