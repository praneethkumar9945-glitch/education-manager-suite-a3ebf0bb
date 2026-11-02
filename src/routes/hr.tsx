import { createFileRoute } from "@tanstack/react-router";
import { HRModule } from "@/components/hr/HRModule";

export const Route = createFileRoute("/hr")({
  head: () => ({
    meta: [
      { title: "HR — Manager Edu" },
      { name: "description", content: "Manager Edu HR module — staff requests and payroll." },
      { property: "og:title", content: "HR — Manager Edu" },
      { property: "og:description", content: "Manager Edu HR module — staff requests and payroll." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HRPage,
});

function HRPage() {
  return <HRModule />;
}
