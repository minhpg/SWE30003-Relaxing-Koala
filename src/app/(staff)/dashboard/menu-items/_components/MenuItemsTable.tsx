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
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { menuItems } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { InferSelectModel } from "drizzle-orm";
import { ChevronDown } from "lucide-react";
import MenuItemActions from "./MenuItemActions";

export type MenuItem = InferSelectModel<typeof menuItems>;

export const columns: ColumnDef<MenuItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.original.name}</span>;
    },
  },
  {
    accessorKey: "vegan",
    header: "Vegan",
    cell: ({ row }) => {
      return (
        <Badge variant={!row.original.vegan ? "default" : "destructive"}>
          {row.original.vegan ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "seafood",
    header: "Seafood",
    cell: ({ row }) => {
      return (
        <Badge variant={!row.original.seafood ? "default" : "destructive"}>
          {row.original.seafood ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return formatCurrency(row.original.price);
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return <Input disabled value={row.original.description || ""} />;
    },
  },
  {
    header: "Menus",
    cell: ({ row }) => {
      const utils = api.useUtils();
      const { toast } = useToast();
      const { data: menus } = api.menus.getAllMenus.useQuery();
      const { data: inMenus } = api.menuItems.getMenuItemInMenus.useQuery(
        row.original.id,
      );
      const addMenu = api.menus.addMenuItemToMenu.useMutation({
        onSuccess: () => {
          toast({
            title: "Menu item added to menu",
            description: "Menu item has been added to the menu",
          });
          utils.menuItems.getMenuItemInMenus.invalidate();
        },
        onError: (error) => {
          toast({
            title: "Error adding menu item to menu",
            description: error.message,
            variant: "destructive",
          });
        },
      });
      const removeMenu = api.menus.removeMenuItemFromMenu.useMutation({
        onSuccess: () => {
          toast({
            title: "Menu item removed from menu",
            description: "Menu item has been removed from the menu",
          });
          utils.menuItems.getMenuItemInMenus.invalidate();
        },
        onError: (error) => {
          toast({
            title: "Error removing menu item from menu",
            description: error.message,
            variant: "destructive",
          });
        },
      });
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Menus <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {menus &&
              menus.map((menu) => (
                <DropdownMenuCheckboxItem
                  key={menu.id}
                  checked={inMenus?.some((m) => m.menuId === menu.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addMenu.mutate({
                        menuItemId: row.original.id,
                        menuId: menu.id,
                      });
                    } else {
                      removeMenu.mutate({
                        menuItemId: row.original.id,
                        menuId: menu.id,
                      });
                    }
                  }}
                >
                  {menu.name}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "",
    header: "Actions",
    cell: ({ row }) => {
      return <MenuItemActions id={row.original.id} />;
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
    rows: MenuItem[];
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

  const [nameFilter, setNameFilter] = useState<string | undefined>(undefined);

  /** Delay fetching after user input to reduce fetching */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setNameFilter(table.getColumn("name")?.getFilterValue() as string);
    }, 300);
    return () => clearTimeout(timeout);
  }, [table.getColumn("name")?.getFilterValue()]);

  const { data: menuItemsData, isLoading } =
    api.menuItems.getMenuItemsPaginated.useQuery({
      ...pagination,
      nameFilter,
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
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
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
