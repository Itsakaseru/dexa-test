import {
  type ColumnDef, type ColumnFiltersState,
  flexRender,
  getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
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
import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { useNavigate } from "react-router";
import { Button } from "../button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function AttendanceTable<TData, TValue>(
  { columns, data }:
    DataTableProps<TData, TValue>
) {
  const [ sorting, setSorting ] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    }
  });

  useEffect(() => {
    table.setPageSize(15);
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            { table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={ headerGroup.id }>
                { headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={ header.id }>
                      { header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        ) }
                    </TableHead>
                  )
                }) }
              </TableRow>
            )) }
          </TableHeader>
          <TableBody>
            { table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={ row.id }
                  data-state={ row.getIsSelected() && "selected" }
                >
                  { row.getVisibleCells().map((cell) => (
                    <TableCell key={ cell.id }>
                      { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                    </TableCell>
                  )) }
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={ columns.length } className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          { table.getState().pagination.pageIndex + 1 } of { table.getPageCount() } pages
        </div>
        <div className="flex flex-row gap-x-2">
          <Button
            variant="outline"
            onClick={ () => table.previousPage() }
            disabled={ !table.getCanPreviousPage() }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={ () => table.nextPage() }
            disabled={ !table.getCanNextPage() }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}