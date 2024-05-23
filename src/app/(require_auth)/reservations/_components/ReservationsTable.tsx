import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReservationsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Table</TableHead>
          <TableHead>Number of Guests</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>10/10/2024</TableCell>
          <TableCell>10:00</TableCell>
          <TableCell>1</TableCell>
          <TableCell>4</TableCell>
          <TableCell>
            <Button>Actions</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
