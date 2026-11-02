import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-full transition-all"
      />
    </div>
  );
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors whitespace-nowrap min-w-[170px]"
      >
        <span className="text-slate-500">{label}:</span>
        <span className="font-medium text-slate-700">{value === 'all' ? 'All' : value}</span>
        <ChevronDown size={14} className="text-slate-400 ml-auto" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[170px] bg-white border border-slate-200 rounded-lg shadow-lg z-[60] py-1 animate-fade-in">
          <button
            onClick={() => { onChange('all'); setOpen(false); }}
            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 ${value === 'all' ? 'text-blue-600 font-medium' : 'text-slate-600'}`}
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 ${value === opt ? 'text-blue-600 font-medium' : 'text-slate-600'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  disabled?: boolean;
}) {
  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon}
      {children}
    </button>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  message,
}: {
  icon: ReactNode;
  title: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{message}</p>
    </div>
  );
}

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">{label}</span>
      <span className="text-sm text-slate-700">{value}</span>
    </div>
  );
}

export function SectionTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      {children}
    </div>
  );
}
