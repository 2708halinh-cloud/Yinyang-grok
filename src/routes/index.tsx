import { createFileRoute } from "@tanstack/react-router";
import { Workbench } from "@/components/xtime/workbench";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Workbench />;
}
