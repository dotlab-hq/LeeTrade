import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel
  
  
  
} from '@tanstack/react-table'
import type {ColumnDef, SortingState, PaginationState} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils.ts'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize?: number
  showPagination?: boolean
}

export function DataTable<TData, TValue>( {
  columns,
  data,
  pageSize = 10,
  showPagination = true,
}: DataTableProps<TData, TValue> ) {
  const [sorting, setSorting] = useState<SortingState>( [] )
  const [pagination, setPagination] = useState<PaginationState>( {
    pageIndex: 0,
    pageSize,
  } )

  const table = useReactTable( {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  } )

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-hairline">
        <table className="w-full border-collapse">
          <thead className="bg-surface-elevated">
            {table.getHeaderGroups().map( ( headerGroup ) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map( ( header ) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-xs font-medium text-body"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ) )}
              </tr>
            ) )}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map( ( row ) => (
                <tr
                  key={row.id}
                  className="border-t border-hairline hover:bg-surface-elevated"
                >
                  {row.getVisibleCells().map( ( cell ) => (
                    <td key={cell.id} className="px-4 py-2 text-sm text-ink">
                      {flexRender( cell.column.columnDef.cell, cell.getContext() )}
                    </td>
                  ) )}
                </tr>
              ) )
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-body">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-body">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                'rounded p-1 hover:bg-surface-elevated disabled:opacity-50'
              )}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={cn(
                'rounded p-1 hover:bg-surface-elevated disabled:opacity-50'
              )}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}