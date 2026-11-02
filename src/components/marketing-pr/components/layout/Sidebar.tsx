import type { Role } from '@/components/marketing-pr/types';
import {
  Shield, Megaphone, TrendingUp, Globe,
  Users, CalendarCheck, Target, FileText,
  Palette, CalendarDays, Handshake, UserPlus,
  GraduationCap, Bell, Menu, ClipboardList, ClipboardCheck, Plus,
} from 'lucide-react';
import type { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface RoleConfig {
  id: Role;
  name: string;
  shortName: string;
  icon: ReactNode;
  color: string;
  nav: NavItem[];
}

export const roleConfigs: RoleConfig[] = [
  {
    id: 'marketing-head',
    name: 'Marketing Head / PRO',
    shortName: 'Marketing Head',
    icon: <Shield size={18} />,
    color: 'text-blue-600 bg-blue-50',
    nav: [
      { id: 'team-coordination', label: 'Dashboard', icon: <ClipboardCheck size={18} /> },
      { id: 'digital-team-dashboard', label: 'Digital Marketing Dashboard', icon: <Globe size={18} /> },
      { id: 'content-team-dashboard', label: 'Content & Brand Dashboard', icon: <Palette size={18} /> },
      { id: 'events-team-dashboard', label: 'Events & Outreach Dashboard', icon: <CalendarDays size={18} /> },
    ],
  },
  {
    id: 'digital',
    name: 'Digital Marketing Executive',
    shortName: 'Digital Marketing',
    icon: <Globe size={18} />,
    color: 'text-cyan-600 bg-cyan-50',
    nav: [
      { id: 'my-tasks', label: 'Tasks', icon: <ClipboardList size={18} /> },
    ],
  },
  {
    id: 'content',
    name: 'Content & Brand Team',
    shortName: 'Content & Brand',
    icon: <Palette size={18} />,
    color: 'text-violet-600 bg-violet-50',
    nav: [
      { id: 'my-tasks', label: 'Tasks', icon: <ClipboardList size={18} /> },
    ],
  },
  {
    id: 'events',
    name: 'Events & Outreach Coordinator',
    shortName: 'Events & Outreach',
    icon: <CalendarDays size={18} />,
    color: 'text-amber-600 bg-amber-50',
    nav: [
      { id: 'my-tasks', label: 'Tasks', icon: <ClipboardList size={18} /> },
    ],
  },
];

export function Sidebar({
  role,
  activePage,
  onNavigate,
  onSwitchRole,
  collapsed,
  onToggleCollapse,
}: {
  role: RoleConfig;
  activePage: string;
  onNavigate: (pageId: string) => void;
  onSwitchRole: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <aside className={`fixed left-0 top-0 h-full w-64 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 ${collapsed ? '-translate-x-full' : 'translate-x-0'}`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-slate-200 flex-shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 leading-tight">College Portal</p>
            <p className="text-[10px] text-slate-400 leading-tight">Marketing & Admissions</p>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-3 pt-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${role.color}`}>
            {role.icon}
            <span className="text-xs font-semibold truncate">{role.name}</span>
          </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {role.nav.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onToggleCollapse();
              }}
              title={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="truncate text-left">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-200 p-2 space-y-1 flex-shrink-0">
        <button
          onClick={onSwitchRole}
          title="Switch Role"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Users size={18} className="flex-shrink-0" />
          <span>Switch Role</span>
        </button>
      </div>
    </aside>
  );
}

export function TopBar({
  breadcrumb,
  pageTitle,
  role,
  notifications,
  onToggleNotifications,
  sidebarCollapsed,
  onToggleSidebar,
  noSidebar = false,
}: {
  breadcrumb: string[];
  pageTitle: string;
  role: RoleConfig;
  notifications: { unread: number };
  onToggleNotifications: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  noSidebar?: boolean;
}) {
  return (
    <header
      className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-6 gap-4"
      style={{ marginLeft: 0 }}
>
      {!noSidebar && (
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Open navigation' : 'Close navigation'}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0"
        >
          <Menu size={20} />
        </button>
      )}
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-shrink-0">
        <span className="text-slate-400">{role.shortName}</span>
        {breadcrumb.map((crumb, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-slate-300">/</span>
            <span className={i === breadcrumb.length - 1 ? 'text-slate-700 font-medium' : 'text-slate-400'}>
              {crumb}
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <button
        onClick={onToggleNotifications}
        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0"
      >
        <Bell size={20} />
        {notifications.unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {notifications.unread}
          </span>
        )}
      </button>

      {/* User profile */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className={`w-8 h-8 rounded-full ${role.color} flex items-center justify-center text-sm font-semibold`}>
          {role.shortName.charAt(0)}
        </div>
        <div className="hidden lg:block">
          <p className="text-xs font-semibold text-slate-700 leading-tight">{role.name}</p>
          <p className="text-[10px] text-slate-400 leading-tight">Administrator</p>
        </div>
      </div>
    </header>
  );
}

export function NotificationsPanel({
  open,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
}: {
  open: boolean;
  onClose: () => void;
  notifications: { id: string; type: string; title: string; message: string; time: string; read: boolean }[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}) {
  if (!open) return null;

  const typeIcons: Record<string, ReactNode> = {
    task: <Users size={16} className="text-blue-500" />,
    content: <FileText size={16} className="text-violet-500" />,
    media: <Megaphone size={16} className="text-amber-500" />,
    campaign: <Target size={16} className="text-emerald-500" />,
    'follow-up': <CalendarCheck size={16} className="text-red-500" />,
    lead: <UserPlus size={16} className="text-cyan-500" />,
    event: <CalendarDays size={16} className="text-amber-500" />,
    pr: <Megaphone size={16} className="text-blue-500" />,
  };

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute right-0 top-16 w-96 bg-white rounded-bl-xl shadow-2xl border-l border-b border-slate-200 max-h-[calc(100vh-4rem)] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
          <button onClick={onMarkAllRead} className="text-xs text-blue-600 hover:underline font-medium">
            Mark all read
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Bell size={24} />
              <p className="text-sm mt-2">No notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`flex gap-3 px-4 py-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}
              >
                <div className="mt-0.5 flex-shrink-0">{typeIcons[n.type] || <Bell size={16} className="text-slate-400" />}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
