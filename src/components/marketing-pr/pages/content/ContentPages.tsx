import { useRef, useState, type ChangeEvent } from 'react';
import { Card, CardHeader, CardBody, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { Badge, statusToVariant } from '@/components/marketing-pr/components/ui/Badge';
import { Table, type Column } from '@/components/marketing-pr/components/ui/Table';
import { Drawer, Modal } from '@/components/marketing-pr/components/ui/Drawer';
import { PageHeader, SearchInput, FilterDropdown, Button, InfoRow, SectionTitle, EmptyState } from '@/components/marketing-pr/components/ui/Common';
import {
  contentItems, socialMediaContents,
  contentReviewItems as initialReviewItems, libraryAssets,
} from '@/components/marketing-pr/data/mockData';
import type { ContentItem, SocialMediaContent, ContentReviewItem, LibraryAsset, ContentStatus } from '@/components/marketing-pr/types';
import {
  FileText, FolderOpen, Megaphone, CheckCircle2, Clock,
  AlertCircle, XCircle, Eye, Search, Image, Video, FileType,
  Palette, Download, ThumbsUp, ThumbsDown, X, Plus, Upload,
} from 'lucide-react';

// ============ CONTENT CREATION ============
const emptyContentForm = { title: '', type: 'Social Media Post' as ContentItem['type'], status: 'Draft' as ContentStatus, createdBy: '', date: '', content: '' };

export function ContentCreation() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [items, setItems] = useState<ContentItem[]>(contentItems);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [form, setForm] = useState(emptyContentForm);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState('Image');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const types = [...new Set(items.map((c) => c.type))];
  const filtered = items.filter((c) => {
    const ms = c.title.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'all' || c.status === statusFilter;
    const mt = typeFilter === 'all' || c.type === typeFilter;
    return ms && mf && mt;
  });

  const openCreate = () => {
    setForm({ ...emptyContentForm, date: new Date().toISOString().slice(0, 10) });
    setCreateOpen(true);
  };

  const openEdit = (item: ContentItem) => {
    setForm({ title: item.title, type: item.type, status: item.status, createdBy: item.createdBy, date: item.date, content: item.content });
    setEditing(item);
  };

  const handleSaveCreate = () => {
    if (!form.title.trim()) return;
    const newItem: ContentItem = { id: `content-${Date.now()}`, ...form };
    setItems([newItem, ...items]);
    setCreateOpen(false);
  };

  const handleSaveEdit = () => {
    if (!editing || !form.title.trim()) return;
    setItems(items.map((c) => (c.id === editing.id ? { ...editing, ...form } : c)));
    setEditing(null);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadFiles(Array.from(event.target.files || []));
  };

  const handleUpload = () => {
    if (uploadFiles.length === 0) return;
    const date = new Date().toISOString().slice(0, 10);
    const uploadedItems: ContentItem[] = uploadFiles.map((file, index) => ({
      id: `uploaded-content-${Date.now()}-${index}`,
      title: file.name,
      type: 'Campaign Material',
      status: 'Draft',
      createdBy: 'Content Team',
      date,
      content: `Uploaded ${uploadType}: ${file.name}`,
    }));
    setItems((prev) => [...uploadedItems, ...prev]);
    setUploadFiles([]);
    setUploadOpen(false);
  };

  const formFields = (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter content title"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Type</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as ContentItem['type'] })}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        >
          {['Social Media Post', 'Website Content', 'Newsletter', 'Campaign Material'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        >
          {['Draft', 'In Review', 'Approved', 'Published'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Created By</label>
          <input
            type="text"
            value={form.createdBy}
            onChange={(e) => setForm({ ...form, createdBy: e.target.value })}
            placeholder="Author name"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Content</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Write the content here..."
          rows={5}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
        />
      </div>
    </div>
  );

  const columns: Column<ContentItem>[] = [
    { key: 'title', header: 'Title', render: (r) => <span className="font-medium text-slate-700">{r.title}</span> },
    { key: 'type', header: 'Type', render: (r) => <Badge variant="blue">{r.type}</Badge> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusToVariant(r.status)}>{r.status}</Badge> },
    { key: 'createdBy', header: 'Created By', render: (r) => <span className="text-slate-500 text-xs">{r.createdBy}</span> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-slate-500 text-xs">{r.date}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Content Creation"
        description="Manage promotional and informational content such as social media posts, website content, newsletters, and campaign materials."
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={<Upload size={16} />} onClick={() => setUploadOpen(true)}>Upload</Button>
            <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>Create Content</Button>
          </div>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Items" value={items.length} icon={<FileText size={20} />} accent="blue" />
        <StatCard label="Published" value={items.filter((c) => c.status === 'Published').length} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="In Review" value={items.filter((c) => c.status === 'In Review').length} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="Drafts" value={items.filter((c) => c.status === 'Draft').length} icon={<FileText size={20} />} accent="slate" />
      </div>
      <Card>
        <CardHeader title="Content Items" subtitle="All created content with status tracking" icon={<FileText size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search content..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={['Draft', 'In Review', 'Approved', 'Published']} onChange={setStatusFilter} />
          <FilterDropdown label="Type" value={typeFilter} options={types} onChange={setTypeFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} onRowDoubleClick={openEdit} emptyMessage="No content found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Content Details" subtitle={selected?.title} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Title" value={selected.title} />
            <InfoRow label="Type" value={selected.type} />
            <InfoRow label="Created By" value={selected.createdBy} />
            <InfoRow label="Date" value={selected.date} />
            <div className="pt-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Content</p>
              <p className="text-sm text-slate-600 leading-relaxed">{selected.content}</p>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Content Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Content"
        subtitle="Add a new content item"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveCreate} disabled={!form.title.trim()}>Create</Button>
          </div>
        }
      >
        {formFields}
      </Modal>

      {/* Edit Content Modal (double-click a row) */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Content"
        subtitle={editing?.title}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveEdit} disabled={!form.title.trim()}>Save Changes</Button>
          </div>
        }
      >
        {formFields}
      </Modal>

      <Modal
        open={uploadOpen}
        onClose={() => { setUploadOpen(false); setUploadFiles([]); }}
        title="Upload Content"
        subtitle="Add images, videos, templates, graphics, or brochures"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => { setUploadOpen(false); setUploadFiles([]); }}>Cancel</Button>
            <Button variant="primary" icon={<Upload size={16} />} onClick={handleUpload} disabled={uploadFiles.length === 0}>Upload</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Content Type</label>
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            >
              {['Image', 'Video', 'Template', 'Graphic', 'Brochure'].map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-slate-200 rounded-lg text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
            <Upload size={24} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Choose files to upload</span>
            <span className="text-xs text-slate-400">You can select multiple files</span>
            <input type="file" multiple className="hidden" onChange={handleFileSelect} />
          </label>
          {uploadFiles.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Selected Files</p>
              {uploadFiles.map((file) => <p key={`${file.name}-${file.lastModified}`} className="text-sm text-slate-600 truncate">{file.name}</p>)}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

// ============ SOCIAL MEDIA CONTENT ============
export function SocialMediaContentPage() {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<SocialMediaContent | null>(null);

  const platforms = [...new Set(socialMediaContents.map((s) => s.platform))];
  const filtered = socialMediaContents.filter((s) => {
    const ms = s.title.toLowerCase().includes(search.toLowerCase());
    const mp = platformFilter === 'all' || s.platform === platformFilter;
    const mf = statusFilter === 'all' || s.status === statusFilter;
    return ms && mp && mf;
  });

  const columns: Column<SocialMediaContent>[] = [
    { key: 'title', header: 'Title', render: (r) => <span className="font-medium text-slate-700">{r.title}</span> },
    { key: 'platform', header: 'Platform', render: (r) => <Badge variant="blue">{r.platform}</Badge> },
    { key: 'topic', header: 'Topic', render: (r) => <Badge variant="slate">{r.topic}</Badge> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusToVariant(r.status)}>{r.status}</Badge> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-slate-500 text-xs">{r.date}</span> },
  ];

  return (
    <div>
      <PageHeader title="Social Media Content" description="Prepare and manage content for the institution's social media channels to communicate programs, achievements, events, and updates." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Posts" value={socialMediaContents.length} icon={<Megaphone size={20} />} accent="blue" />
        <StatCard label="Published" value={socialMediaContents.filter((s) => s.status === 'Published').length} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="In Review" value={socialMediaContents.filter((s) => s.status === 'In Review').length} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="Drafts" value={socialMediaContents.filter((s) => s.status === 'Draft').length} icon={<FileText size={20} />} accent="slate" />
      </div>
      <Card>
        <CardHeader title="Social Media Content" subtitle="All social media content with platform and topic" icon={<Megaphone size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search content..." /></div>
          <FilterDropdown label="Platform" value={platformFilter} options={platforms} onChange={setPlatformFilter} />
          <FilterDropdown label="Status" value={statusFilter} options={['Draft', 'In Review', 'Approved', 'Published']} onChange={setStatusFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No content found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Content Details" subtitle={selected?.title} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Title" value={selected.title} />
            <InfoRow label="Platform" value={selected.platform} />
            <InfoRow label="Topic" value={selected.topic} />
            <InfoRow label="Date" value={selected.date} />
            <InfoRow label="Created By" value={selected.createdBy} />
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ============ CONTENT REVIEW & APPROVAL ============
export function ContentReviewApproval() {
  const [items, setItems] = useState(initialReviewItems);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<ContentReviewItem | null>(null);
  const [actionPickerItem, setActionPickerItem] = useState<ContentReviewItem | null>(null);
  const [actionModal, setActionModal] = useState<{ item: ContentReviewItem; action: 'approve' | 'changes' | 'reject' } | null>(null);
  const [editedContent, setEditedContent] = useState('');

  const filtered = items.filter((c) => {
    const ms = c.title.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'all' || c.status === statusFilter;
    return ms && mf;
  });

  const handleAction = () => {
    if (!actionModal) return;
    const newStatus = actionModal.action === 'approve' ? 'Approved' : actionModal.action === 'changes' ? 'Changes Requested' : 'Rejected';
    setItems((prev) => prev.map((c) => c.id === actionModal.item.id ? {
      ...c,
      ...(actionModal.action === 'changes' ? { content: editedContent } : {}),
      status: newStatus as ContentReviewItem['status'],
    } : c));
    setActionModal(null);
  };

  const openActionConfirmation = (item: ContentReviewItem, action: 'approve' | 'changes' | 'reject') => {
    setActionPickerItem(null);
    setEditedContent(item.content);
    setActionModal({ item, action });
  };

  const columns: Column<ContentReviewItem>[] = [
    { key: 'title', header: 'Content', render: (r) => <span className="font-medium text-slate-700">{r.title}</span> },
    { key: 'type', header: 'Type', render: (r) => <Badge variant="blue">{r.type}</Badge> },
    { key: 'createdBy', header: 'Created By', render: (r) => <span className="text-slate-500 text-xs">{r.createdBy}</span> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-slate-500 text-xs">{r.date}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusToVariant(r.status)}>{r.status}</Badge> },
    { key: 'reviewer', header: 'Reviewer', render: (r) => <span className="text-slate-500 text-xs">{r.reviewer}</span> },
  ];

  return (
    <div>
      <PageHeader title="Content Review & Approval" description="Review content for accuracy, quality, consistency, and alignment with the institution's brand before publication." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Pending Review" value={items.filter((c) => c.status === 'Pending Review').length} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="Approved" value={items.filter((c) => c.status === 'Approved').length} icon={<CheckCircle2 size={20} />} accent="green" />
        <StatCard label="Changes Requested" value={items.filter((c) => c.status === 'Changes Requested').length} icon={<AlertCircle size={20} />} accent="amber" />
        <StatCard label="Rejected" value={items.filter((c) => c.status === 'Rejected').length} icon={<XCircle size={20} />} accent="red" />
      </div>
      <Card>
        <CardHeader title="Review Queue" subtitle="Content items awaiting review and approval" icon={<FileText size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search content..." /></div>
          <FilterDropdown label="Status" value={statusFilter} options={['Pending Review', 'Approved', 'Changes Requested', 'Rejected']} onChange={setStatusFilter} />
        </div>
        <Table
          columns={columns}
          data={filtered}
          onRowClick={setSelected}
          onRowDoubleClick={(item) => setActionPickerItem(item)}
          emptyMessage="No items found"
        />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Content Review Details" subtitle={selected?.title} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected && (
          <div className="space-y-1">
            <Badge variant={statusToVariant(selected.status)}>{selected.status}</Badge>
            <InfoRow label="Title" value={selected.title} />
            <InfoRow label="Type" value={selected.type} />
            <InfoRow label="Created By" value={selected.createdBy} />
            <InfoRow label="Date" value={selected.date} />
            <InfoRow label="Reviewer" value={selected.reviewer} />
            <div className="pt-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Content</p>
              <p className="text-sm text-slate-600 leading-relaxed">{selected.content}</p>
            </div>
          </div>
        )}
      </Drawer>
      <Modal
        open={!!actionPickerItem}
        onClose={() => setActionPickerItem(null)}
        title="Review Content"
        subtitle={actionPickerItem?.title}
      >
        {actionPickerItem && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Choose an action for this content item.</p>
            <div className="grid gap-2">
              <Button variant="success" icon={<ThumbsUp size={16} />} onClick={() => openActionConfirmation(actionPickerItem, 'approve')}>
                Approve
              </Button>
              <Button variant="primary" icon={<AlertCircle size={16} />} onClick={() => openActionConfirmation(actionPickerItem, 'changes')}>
                Request Changes
              </Button>
              <Button variant="danger" icon={<ThumbsDown size={16} />} onClick={() => openActionConfirmation(actionPickerItem, 'reject')}>
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={!!actionModal}
        onClose={() => setActionModal(null)}
        title={
          actionModal?.action === 'approve' ? 'Approve Content' :
          actionModal?.action === 'changes' ? 'Request Changes' : 'Reject Content'
        }
        subtitle={actionModal?.item.title}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button
              variant={actionModal?.action === 'approve' ? 'success' : actionModal?.action === 'reject' ? 'danger' : 'primary'}
              icon={actionModal?.action === 'approve' ? <ThumbsUp size={16} /> : actionModal?.action === 'reject' ? <ThumbsDown size={16} /> : <AlertCircle size={16} />}
              onClick={handleAction}
            >
              {actionModal?.action === 'approve' ? 'Approve' : actionModal?.action === 'changes' ? 'Request Changes' : 'Reject'}
            </Button>
          </div>
        }
      >
        {actionModal && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              {actionModal.action === 'approve' && 'Are you sure you want to approve this content? It will be marked as approved and ready for publication.'}
              {actionModal.action === 'changes' && 'Make any required edits below, then request changes. The content team will be notified.'}
              {actionModal.action === 'reject' && 'Are you sure you want to reject this content? This action cannot be undone.'}
            </p>
            {actionModal.action === 'changes' && (
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Content</label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                />
              </div>
            )}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <InfoRow label="Content" value={actionModal.item.title} />
              <InfoRow label="Type" value={actionModal.item.type} />
              <InfoRow label="Created By" value={actionModal.item.createdBy} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============ CONTENT LIBRARY ============
export function ContentLibrary() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState<LibraryAsset | null>(null);
  const [assets, setAssets] = useState<LibraryAsset[]>(libraryAssets);
  const [showUploadType, setShowUploadType] = useState(false);
  const [uploadType, setUploadType] = useState<'Image' | 'Video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const types = [...new Set(assets.map((a) => a.type))];
  const categories = [...new Set(assets.map((a) => a.category))];
  const filtered = assets.filter((a) => {
    const ms = a.name.toLowerCase().includes(search.toLowerCase());
    const mt = typeFilter === 'all' || a.type === typeFilter;
    const mc = categoryFilter === 'all' || a.category === categoryFilter;
    return ms && mt && mc;
  });

  const handleLibraryUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const today = new Date().toISOString().slice(0, 10);
    const uploadedAssets: LibraryAsset[] = files.map((file, index) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const inferredType: LibraryAsset['type'] = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)
        ? 'Image'
        : ['mp4', 'mov', 'webm'].includes(extension)
          ? 'Video'
          : extension === 'svg'
            ? 'Graphic'
            : extension === 'pdf'
              ? 'Brochure'
              : 'Template';
      const size = file.size >= 1048576
        ? `${(file.size / 1048576).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;
      return {
        id: `library-upload-${Date.now()}-${index}`,
        name: file.name,
        type: uploadType || inferredType,
        category: 'Uploaded Files',
        uploadDate: today,
        uploadedBy: 'Content & Brand Team',
        size,
      };
    });
    setAssets((previous) => [...uploadedAssets, ...previous]);
    setUploadType(null);
    event.target.value = '';
  };

  const typeIcons: Record<string, typeof Image> = {
    Image: Image, Video: Video, Graphic: Palette, Brochure: FileText, Template: FileType,
  };

  const columns: Column<LibraryAsset>[] = [
    { key: 'name', header: 'Name', render: (r) => (
      <div className="flex items-center gap-2">
        {(() => { const Icon = typeIcons[r.type] || FileText; return <Icon size={16} className="text-slate-400" />; })()}
        <span className="font-medium text-slate-700">{r.name}</span>
      </div>
    )},
    { key: 'type', header: 'Type', render: (r) => <Badge variant="blue">{r.type}</Badge> },
    { key: 'category', header: 'Category', render: (r) => <Badge variant="slate">{r.category}</Badge> },
    { key: 'date', header: 'Upload Date', render: (r) => <span className="text-slate-500 text-xs">{r.uploadDate}</span> },
    { key: 'uploadedBy', header: 'Uploaded By', render: (r) => <span className="text-slate-500 text-xs">{r.uploadedBy}</span> },
    { key: 'size', header: 'Size', render: (r) => <span className="text-slate-500 text-xs">{r.size}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Content Library"
        description="Store and organize approved images, videos, graphics, brochures, templates, and other brand assets for team use."
        action={(
          <>
            <input ref={fileInputRef} type="file" multiple accept={uploadType === 'Image' ? 'image/*' : uploadType === 'Video' ? 'video/*' : undefined} className="hidden" onChange={handleLibraryUpload} />
            <Button variant="primary" icon={<Upload size={16} />} onClick={() => setShowUploadType(true)}>Upload</Button>
          </>
        )}
      />
      <Modal
        open={showUploadType}
        onClose={() => { setShowUploadType(false); setUploadType(null); }}
        title="Choose Upload Type"
        subtitle="Select whether you are uploading an image or video."
        footer={(
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => { setShowUploadType(false); setUploadType(null); }}>Cancel</Button>
            <Button variant="primary" icon={<Upload size={16} />} disabled={!uploadType} onClick={() => { setShowUploadType(false); fileInputRef.current?.click(); }}>Choose File</Button>
          </div>
        )}
      >
        <div className="grid grid-cols-2 gap-3">
          {(['Image', 'Video'] as const).map((type) => {
            const Icon = type === 'Image' ? Image : Video;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={uploadType === type}
                onClick={() => setUploadType(type)}
                className={`flex flex-col items-center gap-2 rounded-lg border p-5 transition-colors ${uploadType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}
              >
                <Icon size={22} />
                <span className="text-sm font-medium">{type}</span>
              </button>
            );
          })}
        </div>
      </Modal>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Total Assets" value={assets.length} icon={<FolderOpen size={20} />} accent="blue" />
        <StatCard label="Images" value={assets.filter((a) => a.type === 'Image').length} icon={<Image size={20} />} accent="green" />
        <StatCard label="Videos" value={assets.filter((a) => a.type === 'Video').length} icon={<Video size={20} />} accent="indigo" />
        <StatCard label="Templates" value={assets.filter((a) => a.type === 'Template').length} icon={<FileType size={20} />} accent="amber" />
      </div>
      <Card>
        <CardHeader title="Asset Library" subtitle="All brand assets and materials" icon={<FolderOpen size={18} />} />
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search assets..." /></div>
          <FilterDropdown label="Type" value={typeFilter} options={types} onChange={setTypeFilter} />
          <FilterDropdown label="Category" value={categoryFilter} options={categories} onChange={setCategoryFilter} />
        </div>
        <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No assets found" />
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Asset Details" subtitle={selected?.name} footer={
        selected && <div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button><Button variant="primary" icon={<Download size={16} />}>Download</Button></div>
      }>
        {selected && (
          <div className="space-y-1">
            <Badge variant="blue">{selected.type}</Badge>
            <Badge variant="slate">{selected.category}</Badge>
            <InfoRow label="Name" value={selected.name} />
            <InfoRow label="Type" value={selected.type} />
            <InfoRow label="Category" value={selected.category} />
            <InfoRow label="Upload Date" value={selected.uploadDate} />
            <InfoRow label="Uploaded By" value={selected.uploadedBy} />
            <InfoRow label="File Size" value={selected.size} />
          </div>
        )}
      </Drawer>
    </div>
  );
}
