import {
  type ColumnDef, type ColumnFiltersState,
  flexRender,
  getCoreRowModel, getFilteredRowModel, getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useState } from "react";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {redirect, useNavigate} from "react-router";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function EmployeeTable<TData, TValue>(
  { columns, data }:
  DataTableProps<TData, TValue>
) {
  const [ sorting, setSorting ] = useState<SortingState>([]);
  const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([]);
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    }
  })

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <Input
          className="max-w-xs"
          name="search"
          type="text"
          placeholder="Filter employee by name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
      </div>
      <div className="col-start-3 flex justify-end">
        <Button variant="outline" onClick={() => navigate("/employee/create")}>Add Employee</Button>
      </div>
      <div className="col-span-3 rounded-md border">
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
                  )
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}