"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { reservations } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { format, isBefore } from "date-fns";
import { InferSelectModel } from "drizzle-orm";
import { ChevronDown } from "lucide-react";
import ReservationActions from "./ReservationActions";

export type Reservation = InferSelectModel<typeof reservations>;

export const columns: ColumnDef<Reservation>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.original.name}</span>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "noOfGuests",
    header: "Guests",
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            isBefore(row.original.time, new Date()) ? "destructive" : "default"
          }
        >
          {format(row.original.time, "dd/MM/yyyy - hh:mm")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      return <Input disabled value={row.original.message || ""} />;
    },
  },
  {
    accessorKey: "",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <ReservationActions
          id={row.original.id}
          disabled={isBefore(row.original.time, new Date())}
        />
      );
    },
  },
];

export default function ReservationsTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<{
    rows: Reservation[];
    totalCount: number;
  }>({
    rows: [],
    totalCount: 0,
  });

  const table = useReactTable({
    data: data.rows,
    columns,
    rowCount: data.totalCount,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
  });

  const [emailFilter, setEmailFilter] = useState<string | undefined>(undefined);

  /** Delay fetching after user input to reduce fetching */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setEmailFilter(table.getColumn("email")?.getFilterValue() as string);
    }, 300);
    return () => clearTimeout(timeout);
  }, [table.getColumn("email")?.getFilterValue()]);

  const { data: usersData, isLoading } =
    api.reservations.getUserReservationsPaginated.useQuery({
      ...pagination,
      emailFilter,
    });

  useEffect(() => {
    if (usersData) setData(usersData);
  }, [usersData]);

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm outline-none"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {!isLoading &&
                (table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                ))}
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className=" h-24 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
