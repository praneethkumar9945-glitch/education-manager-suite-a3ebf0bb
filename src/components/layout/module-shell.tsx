import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModuleShell({ title, subtitle, navigation, actions, footer, children }: {
  title: string;
  subtitle?: string;
  navigation: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="module-workspace -m-4 flex min-h-[calc(100vh-4rem)] min-w-0 bg-muted/30 text-foreground md:-m-6">
      <aside className="module-navigation hidden w-[232px] shrink-0 flex-col md:flex">
        <div className="border-b border-module-border px-5 py-5">
          <p className="text-[11px] font-semibold uppercase text-module-muted">Module</p>
          <h2 className="mt-1 text-lg font-semibold text-module-foreground">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-module-muted">{subtitle}</p>}
        </div>
        <nav aria-label={`${title} navigation`} className="flex-1 space-y-0.5 px-2 py-3">{navigation}</nav>
        {footer && <div className="border-t border-module-border p-3">{footer}</div>}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-4 py-2 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
            <span className="text-sm font-medium">{subtitle ?? title}</span>
          </div>
          <div className="flex max-w-full flex-wrap items-center gap-2">{actions}</div>
        </header>
        {open && <div className="module-navigation border-b border-module-border md:hidden">
          <nav aria-label={`${title} mobile navigation`} className="space-y-0.5 p-2" onClick={() => setOpen(false)}>{navigation}</nav>
          {footer && <div className="border-t border-module-border p-3">{footer}</div>}
        </div>}
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export function ModuleNavButton({ active, icon, children, onClick }: { active: boolean; icon: ReactNode; children: ReactNode; onClick: () => void }) {
  return <Button variant="ghost" onClick={onClick} className={cn("module-nav-item h-auto min-h-10 w-full justify-start gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium", active && "module-nav-active")}>{icon}<span className="min-w-0 whitespace-normal">{children}</span></Button>;
}