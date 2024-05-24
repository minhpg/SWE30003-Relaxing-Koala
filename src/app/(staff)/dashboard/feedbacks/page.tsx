"use client";

import { Separator } from "@/components/ui/separator";
import FeedbacksTable from "./_components/FeedbacksTable";

export default function ReservationsPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Feedbacks</h2>
          <p className="text-muted-foreground">View all feedbacks.</p>
        </div>
      </div>
      <Separator />
      <FeedbacksTable />
    </>
  );
}
