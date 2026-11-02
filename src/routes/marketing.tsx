import { createFileRoute } from "@tanstack/react-router";
import MarketingApp from "@/components/marketing-pr/App";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/marketing")({
  head: () => ({
    meta: [
      { title: "Marketing & PR — Manager Edu" },
      { name: "description", content: "Marketing, admissions outreach and PR workspace: campaigns, digital marketing, content, events and team coordination." },
      { property: "og:title", content: "Marketing & PR — Manager Edu" },
      { property: "og:description", content: "Marketing, admissions outreach and PR workspace: campaigns, digital marketing, content, events and team coordination." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MarketingPage,
});

function MarketingPage() {
  return (
    <AppShell title="Marketing & PR">
      <div className="min-w-0">
        <MarketingApp />
      </div>
    </AppShell>
  );
}
