import type { ReactNode } from 'react';

export type BadgeVariant =
  | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  | 'purple' | 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'indigo';

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  error: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  purple: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  slate: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
};

export function Badge({
  children,
  variant = 'neutral',
  className = '',
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function statusToVariant(status: string): BadgeVariant {
  const s = status.toLowerCase();
  if (['completed', 'approved', 'published', 'active', 'admitted', 'responded', 'closed', 'strong', 'positive'].includes(s)) return 'green';
  if (['in progress', 'in review', 'under review', 'scheduled', 'contacted', 'interested', 'applied', 'confirmed', 'assigned', 'pending review', 'planning'].includes(s)) return 'blue';
  if (['pending', 'due', 'on hold', 'proposed', 'follow-up', 'new lead', 'draft', 'open', 'stable'].includes(s)) return 'amber';
  if (['overdue', 'needs attention', 'cancelled', 'rejected', 'negative', 'on hold'].includes(s)) return 'red';
  if (['neutral'].includes(s)) return 'slate';
  return 'slate';
}
