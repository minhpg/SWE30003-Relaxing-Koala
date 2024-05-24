"use client";

import {
  ColumnDef,
  ColumnFiltersState,
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

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { api, RouterOutputs } from "@/trpc/react";
import OrderActions from "./OrderActions";

export type Order = RouterOutputs["orders"]["getOrdersPaginated"]["rows"][0];

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "",
    header: "Actions",
  },
];

export default function OrdersTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<{
    rows: RouterOutputs["orders"]["getOrdersPaginated"]["rows"];
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

  const { data: ordersData, isLoading } =
    api.orders.getOrdersPaginated.useQuery({
      ...pagination,
    });

  useEffect(() => {
    if (ordersData) setData(ordersData);
  }, [ordersData]);

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {!isLoading ? (
            table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Card key={row.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg transition-all hover:underline">
                        Order #{row.original.id}
                      </CardTitle>
                      <Badge
                        className="capitalize"
                        variant={
                          row.original.status === "COMPLETED"
                            ? "default"
                            : row.original.status === "CANCELLED"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {row.original.status?.toLocaleLowerCase()}
                      </Badge>
                    </div>
                    <CardDescription>
                      Table #{row.original.tableNumber}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex h-full flex-1 flex-col py-2">
                    <div className="flex flex-1 flex-col gap-2">
                      {row.original.menuItemsToOrder.map((item) => (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <p>{item.menuItem.name}</p>
                            <p>
                              {item.quantity} x{" "}
                              {formatCurrency(item.menuItem.price)}
                            </p>
                          </div>
                          <Separator />
                        </>
                      ))}
                    </div>
                    <p className="my-4 text-sm">
                      Notes:{" "}
                      <span className="text-muted-foreground">
                        {row.original.notes}
                      </span>
                    </p>

                    <Separator />

                    <div className="flex items-center justify-between py-3 text-sm">
                      <p className="font-semibold">Total</p>
                      <p>
                        {formatCurrency(
                          row.original.menuItemsToOrder.reduce((acc, curr) => {
                            return acc + curr.quantity * curr.menuItem.price;
                          }, 0),
                        )}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <OrderActions id={row.original.id} />
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No orders</p>
            )
          ) : (
            <p>Loading...</p>
          )}
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
