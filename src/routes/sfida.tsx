import { createFileRoute, redirect } from "@tanstack/react-router";

/** La vecchia FactaChallenge è diventata "Gioca oggi": i link condivisi restano validi. */
export const Route = createFileRoute("/sfida")({
  beforeLoad: () => {
    throw redirect({ to: "/gioca", replace: true });
  },
});
