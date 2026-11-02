import { Button } from '@/components/ui/button';
import type { RoleConfig } from '@/components/marketing-pr/components/layout/Sidebar';
import { GraduationCap } from 'lucide-react';
import type { ReactNode } from 'react';

const roleDescriptions: Record<string, string> = {
  'marketing-head': 'Monitor team work, review submissions, and coordinate Marketing & PR activities',
  'digital': 'Create Website, Social Media, SEO, and Ad Campaign tasks',
  'content': 'Create Prospectus, Brochures, and Newsletters tasks',
  'events': 'Create Education Fairs, School Partnerships, and Open Days tasks',
};

export function CoverPage({
  roles,
  onSelectRole,
  sidebarCollapsed,
}: {
  roles: RoleConfig[];
  onSelectRole: (roleId: string) => void;
  sidebarCollapsed: boolean;
}) {
  return (
    <div className="w-full max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <GraduationCap size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Marketing & PR</h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl mx-auto">
              
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Select Role</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
          {roles.map((role) => (
            <Button variant="outline"
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="group h-auto items-start justify-start gap-4 whitespace-normal rounded-lg p-5 text-left hover:border-primary"
            >
              <div className={`w-10 h-10 shrink-0 rounded-md flex items-center justify-center bg-primary/10 text-primary`}>
                {cloneIcon(role.icon, 24)}
              </div>
              <div className="min-w-0"><h3 className="text-base font-semibold text-slate-800 mb-1">{role.id === 'content' ? 'Content / Brand Team' : role.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{roleDescriptions[role.id]}</p></div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function cloneIcon(icon: ReactNode, size: number): ReactNode {
  // The icons from roleConfigs are lucide-react elements with size={18};
  // we re-render with a larger size for the cover page.
  // We use a type assertion to access the type prop for cloning.
  const iconEl = icon as React.ReactElement<{ size?: number }>;
  if (iconEl.props && typeof iconEl.props.size === 'number') {
    const { type, props } = iconEl;
    const Comp = type as React.ComponentType<{ size?: number } & Record<string, unknown>>;
    return <Comp {...props} size={size} />;
  }
  return icon;
}
