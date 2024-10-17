"use client";

import { useMemo, useCallback, useState } from "react";
import { UserTableSkeleton } from "@/components/dashboard/user-table-skeleton";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useUserData from "@/hooks/useUserData";
import { User } from "@/types/user";
import { Beams } from "../ui/grid-hero";

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "profilePhoto",
    header: "",
    cell: ({ row }) => {
      const profilePhoto = row.getValue("profilePhoto") as string | null;
      return (
        <div className="flex items-center">
          {profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profilePhoto}
              alt={`${row.getValue("username")}'s avatar`}
              className="rounded-full w-8 h-8"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">
                {(row.getValue("username") as string)?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ row }) => <div>{row.getValue("ipAddress")}</div>,
  },
  {
    accessorKey: "location",
    header: "Country",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    accessorKey: "downloadSpeed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Download Speed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-8">{row.getValue("downloadSpeed") ?? 0} Mbps</div>
    ),
  },
  {
    accessorKey: "uploadSpeed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Upload Speed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-8">{row.getValue("uploadSpeed") ?? 0} Mbps</div>
    ),
  },
  {
    accessorKey: "points",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="ml-4">{row.getValue("points")}</div>,
  },
  {
    accessorKey: "totalTimeOfUsingApp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Shared Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-10">
        {((row.getValue("totalTimeOfUsingApp") as number) / 3600000).toFixed(2)}{" "}
        hours
      </div>
    ),
  },
];

export default function UserTable() {
  const { users, isLoading, error } = useUserData();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const data = useMemo(() => {
    if (!users) return [];
    return [...users].sort((a, b) => b.points - a.points);
  }, [users]);

  const table = useReactTable({
    data,
    columns,
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
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const calculateActiveUsers = useCallback(() => {
    if (!data.length) return { daily: 0, weekly: 0, monthly: 0 };
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    return data.reduce(
      (acc: { daily: number; weekly: number; monthly: number }, user: User) => {
        const lastCheckIn = new Date(user.lastCheckIn);
        const timeDiff = now.getTime() - lastCheckIn.getTime();

        if (timeDiff <= oneDay) acc.daily++;
        if (timeDiff <= oneWeek) acc.weekly++;
        if (timeDiff <= oneMonth) acc.monthly++;

        return acc;
      },
      { daily: 0, weekly: 0, monthly: 0 }
    );
  }, [data]);

  const calculateTotals = useCallback(() => {
    if (!data.length)
      return { downloadSpeed: 0, uploadSpeed: 0, sharedTime: 0 };
    return data.reduce(
      (
        acc: { downloadSpeed: number; uploadSpeed: number; sharedTime: number },
        user: User
      ) => {
        acc.downloadSpeed += user.downloadSpeed ?? 0;
        acc.uploadSpeed += user.uploadSpeed ?? 0;
        acc.sharedTime += user.totalTimeOfUsingApp;
        return acc;
      },
      { downloadSpeed: 0, uploadSpeed: 0, sharedTime: 0 }
    );
  }, [data]);

  const totalCountOfHasSpeedTestDone = useMemo(
    () => data.filter((user) => user.downloadSpeed && user.uploadSpeed).length,
    [data]
  );
  const totalCountOfHasSpeedTestInThisWeek = useMemo(
    () =>
      data.filter((user) => {
        const lastSpeedTestDate = new Date(user.lastSpeedTestDate);
        const now = new Date();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        return now.getTime() - lastSpeedTestDate.getTime() <= oneWeek;
      }).length,
    [data]
  );

  const totalCountOfHasSpeedTestInThisMonth = useMemo(
    () =>
      data.filter((user) => {
        const lastSpeedTestDate = new Date(user.lastSpeedTestDate);
        const now = new Date();
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        return now.getTime() - lastSpeedTestDate.getTime() <= oneMonth;
      }).length,
    [data]
  );

  const totalDownloadSpeedOfThisMonth = useMemo(
    () =>
      data
        .filter((user) => {
          const lastSpeedTestDate = new Date(user.lastSpeedTestDate);
          const now = new Date();
          const oneMonth = 30 * 24 * 60 * 60 * 1000;
          return now.getTime() - lastSpeedTestDate.getTime() <= oneMonth;
        })
        .reduce((acc, user) => acc + (user.downloadSpeed ?? 0), 0),
    [data]
  );

  const totalUploadSpeedOfThisMonth = useMemo(
    () =>
      data
        .filter((user) => {
          const lastSpeedTestDate = new Date(user.lastSpeedTestDate);
          const now = new Date();
          const oneMonth = 30 * 24 * 60 * 60 * 1000;
          return now.getTime() - lastSpeedTestDate.getTime() <= oneMonth;
        })
        .reduce((acc, user) => acc + (user.uploadSpeed ?? 0), 0),
    [data]
  );

  const activeUsers = useMemo(
    () => calculateActiveUsers(),
    [calculateActiveUsers]
  );
  const totals = useMemo(() => calculateTotals(), [calculateTotals]);

  if (isLoading) {
    return <UserTableSkeleton />;
  }

  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter usernames..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
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
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex space-x-2 text-sm text-muted-foreground">
          <div>Daily Active Users: {activeUsers.daily}</div>
          <div>Weekly Active Users: {activeUsers.weekly}</div>
          <div>Monthly Active Users: {activeUsers.monthly}</div>
        </div>
        <div className="space-x-2">
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
      <div className="mt-4 text-sm text-muted-foreground">
        <div>Total Download Speed: {totals.downloadSpeed.toFixed(2)} Mbps</div>
        <div>Total Upload Speed: {totals.uploadSpeed.toFixed(2)} Mbps</div>
        <div>
          Total Shared Time: {(totals.sharedTime / 3600000).toFixed(2)} hours
        </div>
        <div>
          Total Users who have done Speed Test: {totalCountOfHasSpeedTestDone}
        </div>
        <div>
          Total Users who have done Speed Test in this week:{" "}
          {totalCountOfHasSpeedTestInThisWeek}
        </div>
        <div>
          Total Users who have done Speed Test in this month:{" "}
          {totalCountOfHasSpeedTestInThisMonth}
        </div>
        <div>
          Total Download Speed of this month:{" "}
          {totalDownloadSpeedOfThisMonth.toFixed(2)} Mbps
        </div>
        <div>
          Total Upload Speed of this month:{" "}
          {totalUploadSpeedOfThisMonth.toFixed(2)} Mbps
        </div>
      </div>
      <Beams />
    </div>
  );
}
