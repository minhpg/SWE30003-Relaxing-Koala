"use client";

import { useEffect, useState } from "react";
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

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { api } from "@/trpc/react";
import { InferSelectModel } from "drizzle-orm";
import { reservations } from "@/server/db/schema";
import { format } from "date-fns";
import { ArrowDown, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import ReservationActions from "./ReservationActions";

export interface UsersTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

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
      return format(row.original.time, "dd/MM/yyyy - hh:mm");
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
      return <ReservationActions id={row.original.id} />;
    },
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Created at",
  //   cell: ({ row }) => {
  //     return format(row.original.createdAt, "dd/MM/yyyy");
  //   },
  // },
  // {
  //   accessorKey: "role",
  //   header: "Role",
  //   cell: ({ row }) => {
  //     const toast = useToast();
  //     // const utils = api.useUtils();

  //     // const roleMutation = api..updateUserRole.useMutation({
  //     //   onSuccess: () => {
  //     //     toast.toast({
  //     //       title: "Update success",
  //     //       description: `Updated role for ${row.original.name} - ${row.original.email}`,
  //     //     });
  //     //     // utils.users.getUsersPaginated.refetch();
  //     //   },
  //     //   onError: () => {
  //     //     toast.toast({
  //     //       title: "Update failed",
  //     //       description: `Fail to update role for ${row.original.name} - ${row.original.email}`,
  //     //       variant: "destructive",
  //     //     });
  //     //   },
  //     // });

  //     return (
  //       <Select
  //         defaultValue={row.original.role || "Not selected"}
  //         onValueChange={async (value) => {
  //           await roleMutation.mutate({
  //             userId: row.original.id,
  //             role: value as (typeof roles)[number],
  //           });
  //         }}
  //       >
  //         <SelectTrigger>
  //           <SelectValue></SelectValue>
  //         </SelectTrigger>
  //         <SelectContent>
  //           {roles.map((role) => (
  //             <SelectItem value={role} key={role}>
  //               {role}
  //             </SelectItem>
  //           ))}
  //         </SelectContent>
  //       </Select>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "organizationId",
  //   header: "Organization",
  //   cell: ({ row }) => {
  //     const toast = useToast();
  //     // const utils = api.useUtils();

  //     const roleMutation = api.users.updateUserOrganization.useMutation({
  //       onSuccess: () => {
  //         toast.toast({
  //           title: "Update success",
  //           description: `Updated organization for ${row.original.name} - ${row.original.email}`,
  //         });
  //         // utils.users.getUsersPaginated.refetch();
  //       },
  //       onError: () => {
  //         toast.toast({
  //           title: "Update failed",
  //           description: `Fail to update organization for ${row.original.name} - ${row.original.email}`,
  //           variant: "destructive",
  //         });
  //       },
  //     });

  //     const { data: organizations } =
  //       api.organizations.getOrganizationsPaginated.useQuery({
  //         pageIndex: 0,
  //         pageSize: 10,
  //       });

  //     return (
  //       <Select
  //         defaultValue={row.original.organizationId || "Not selected"}
  //         onValueChange={async (value) => {
  //           await roleMutation.mutate({
  //             userId: row.original.id,
  //             organizationId: value as string,
  //           });
  //         }}
  //       >
  //         <SelectTrigger>
  //           <SelectValue placeholder="Select an organization"></SelectValue>
  //         </SelectTrigger>
  //         <SelectContent>
  //           {!organizations && (
  //             <div className="flex w-full justify-center">
  //               <RiLoader4Fill className="h-6 w-6 animate-spin text-primary" />
  //             </div>
  //           )}

  //           {organizations &&
  //             organizations.rows.map((org) => (
  //               <SelectItem value={org.id} key={org.id}>
  //                 {org.name}
  //               </SelectItem>
  //             ))}
  //         </SelectContent>
  //       </Select>
  //     );
  //   },
  // },
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
    api.reservations.getReservationsPaginated.useQuery({
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
