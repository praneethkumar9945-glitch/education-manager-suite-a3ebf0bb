import { createFileRoute } from "@tanstack/react-router";
import { FeeConcessionForm } from "@/components/sales/admissions/fee-concession";

export const Route = createFileRoute("/admission/fee-concession")({
  component: FeeConcessionPage,
});

function FeeConcessionPage() {
  return <FeeConcessionForm />;
}
