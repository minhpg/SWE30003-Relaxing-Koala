import { Separator } from "@/components/ui/separator";

import NewReservationDialog from "./_components/NewReservationDialog";
import ReservationsTable from "./_components/ReservationsTable";

export default function ReservationPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Your reservations
          </h2>
          <p className="text-muted-foreground">View your reservations.</p>
        </div>
        <div>
          <NewReservationDialog />
        </div>
      </div>
      <Separator />
      <ReservationsTable />
    </>
  );
}
