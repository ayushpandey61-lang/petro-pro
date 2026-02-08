import React, { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateCsv, generatePdf, generateXlsx } from '@/lib/reportUtils';
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

const SortableHeader = ({ column, children }) => {
  const getSortIcon = () => {
    if (!column.getCanSort()) return null;

    const sortDirection = column.getIsSorted();
    if (sortDirection === 'asc') {
      return <ChevronUp className="ml-1 h-3 w-3" />;
    } else if (sortDirection === 'desc') {
      return <ChevronDown className="ml-1 h-3 w-3" />;
    } else {
      return <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />;
    }
  };

  return (
    <Button
      variant="ghost"
      className="h-auto p-0 font-semibold hover:bg-transparent"
      onClick={column.getToggleSortingHandler()}
    >
      <span>{children}</span>
      {getSortIcon()}
    </Button>
  );
};

export function DataTable({
  columns,
  data,
  filterColumn,
  onDelete,
  loading,
  showToolbar = true,
  orgDetails,
  reportTitle = "Report",
  initialGlobalFilter = ""
}) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter)
  const { toast } = useToast()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: 'includesString',
  })

  const handleDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
        toast({
            variant: "destructive",
            title: "No rows selected",
            description: "Please select rows to delete.",
        });
        return;
    }
    const idsToDelete = selectedRows.map(row => row.original.id);
    if (typeof onDelete === 'function') {
        onDelete(idsToDelete);
        setRowSelection({});
    }
  };

  const getExportData = () => {
    const headers = getExportHeaders();
    return table.getFilteredRowModel().rows.map(row => {
      const dataRow = {};
      headers.forEach(header => {
        dataRow[header.key] = row.original[header.key] || '';
      });
      return Object.values(dataRow);
    });
  };

  const getExportHeaders = () => {
      return columns
        .filter(c => c.accessorKey && c.id !== 'select' && c.id !== 'actions')
        .map(c => ({ label: typeof c.header === 'string' ? c.header : c.accessorKey, key: c.accessorKey }));
  }

  return (
    <div className="space-y-4">
      {showToolbar && (
        <div className="flex flex-wrap items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-2">
                {onDelete && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive" size="sm" disabled={Object.keys(rowSelection).length === 0 || loading}>
                                Delete Selected
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the selected entries. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                 <Button variant="outline" size="sm" onClick={() => {toast({title: "🚧 Feature not implemented", description:"This will be available soon"})}} disabled={loading}>Add to Billing</Button>
                 <Button variant="outline" size="sm" onClick={() => window.print()} disabled={loading}>Direct Print</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                 <Select
                    value={table.getState().pagination.pageSize}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value))
                    }}
                    >
                    <SelectTrigger className="h-8 w-[90px]">
                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem value="10">Show 10</SelectItem>
                        {[20, 30, 50, 100].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                            Show {pageSize}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => generatePdf({ title: reportTitle, headers: getExportHeaders(), data: getExportData(), orgDetails: orgDetails || {} })}>PDF</Button>
                 <Button variant="outline" size="sm" onClick={() => generateXlsx({ title: reportTitle, headers: getExportHeaders(), data: getExportData(), orgDetails: orgDetails || {} })}>XLSX</Button>
                 <Button variant="outline" size="sm" onClick={() => generateCsv({ title: reportTitle, headers: getExportHeaders(), data: getExportData() })}>CSV</Button>
            </div>
             <div className="flex items-center gap-2">
                <Input
                  placeholder={`Filter by ${filterColumn}...`}
                  value={(table.getColumn(filterColumn)?.getFilterValue()) ?? ""}
                  onChange={(event) =>
                    table.getColumn(filterColumn)?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm h-8"
                />
                {initialGlobalFilter !== undefined && (
                  <Input
                    placeholder="Global search..."
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(String(event.target.value))}
                    className="max-w-sm h-8"
                  />
                )}
            </div>
        </div>
      )}

      {/* Scrollable table container */}
      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                  {headerGroup.headers.map((header) => {
                    const headerContent = header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        );

                    // Wrap sortable headers with SortableHeader component
                    const finalHeaderContent = header.column.getCanSort() && headerContent
                      ? (
                        <SortableHeader column={header.column}>
                          {typeof headerContent === 'string' ? headerContent : headerContent}
                        </SortableHeader>
                      )
                      : headerContent;

                    return (
                      <TableHead key={header.id} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-foreground">
                        {finalHeaderContent}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                   <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                          Loading data...
                      </TableCell>
                  </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
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
    </div>
  )
}