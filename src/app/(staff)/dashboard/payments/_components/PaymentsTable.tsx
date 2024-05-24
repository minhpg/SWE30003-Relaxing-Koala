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
import { formatCurrency } from "@/lib/utils";
import { payment } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { InferSelectModel } from "drizzle-orm";
import { ChevronDown } from "lucide-react";

export type Payment = InferSelectModel<typeof payment>;

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "orderId",
    header: "Order",
    cell: ({ row }) => {
      return <span className="font-semibold">#{row.original.orderId}</span>;
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.paymentStatus === "COMPLETED"
              ? "default"
              : row.original.paymentStatus === "CANCELLED"
                ? "destructive"
                : "outline"
          }
          className="capitalize"
        >
          {row.original.paymentStatus?.toLocaleLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      return (
        <span className="capitalize">
          {row.original.paymentMethod?.toLocaleLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return formatCurrency(row.original.amount);
    },
  },
  {
    accessorKey: "invoiceName",
    header: "Invoice Name",
  },
  {
    accessorKey: "invoiceEmailAddress",
    header: "Email address",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      return (
        <span>{format(row.original.createdAt, "dd/MM/yyyy - hh:mm")}</span>
      );
    },
  },
  // {
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     return <Button>Print invoice</Button>;
  //   },
  // },
];

export default function PaymentsTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<{
    rows: Payment[];
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
      setEmailFilter(
        table.getColumn("invoiceEmailAddress")?.getFilterValue() as string,
      );
    }, 300);
    return () => clearTimeout(timeout);
  }, [table.getColumn("invoiceEmailAddress")?.getFilterValue()]);

  const { data: menuItemsData, isLoading } =
    api.payments.getPaymentsPaginated.useQuery({
      ...pagination,
      emailFilter,
    });

  useEffect(() => {
    if (menuItemsData) setData(menuItemsData);
  }, [menuItemsData]);

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter name..."
            value={
              (table
                .getColumn("invoiceEmailAddress")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("invoiceEmailAddress")
                ?.setFilterValue(event.target.value)
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
