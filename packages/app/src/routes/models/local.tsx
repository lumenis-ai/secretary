import type { ListResponse } from 'ollama'
import { useQuery } from '@tanstack/react-query'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Loader2Icon, RefreshCcwIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BASE_URL } from '@/lib/ollama'
import { formatTime } from '@/lib/time'

export default function LocalModels() {
  const { data: localModels, isLoading: localModelsLoading, refetch: refetchLocalModels } = useQuery({
    queryKey: ['local-models'],
    queryFn: () => {
      return fetch(`${BASE_URL}/api/tags`).then(res => res.json()) as Promise<ListResponse>
    },
  })
  const { data: localModelsRunning, isLoading: localModelsRunningLoading, refetch: refetchLocalModelsRunning } = useQuery({
    queryKey: ['local-models-running'],
    queryFn: () => {
      return fetch(`${BASE_URL}/api/ps`).then(res => res.json()) as Promise<ListResponse>
    },
  })
  const isLoading = useMemo(() => localModelsLoading || localModelsRunningLoading, [localModelsLoading, localModelsRunningLoading])
  const refreshData = () => {
    refetchLocalModels()
    refetchLocalModelsRunning()
  }

  const table = useReactTable({
    data: localModels?.models ?? [],
    columns: [
      {
        id: 'name',
        header: 'Model Name',
        accessorKey: 'name',
      },
      {
        id: 'modified_at',
        header: 'Last Modified At',
        accessorKey: 'modified_at',
        cell: ({ row }) => {
          return <span>{formatTime(row.original.modified_at as unknown as string)}</span>
        },
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          if (localModelsRunning?.models?.some(model => model.model === row.original.model)) {
            return <Badge>Running</Badge>
          }

          return <Badge variant="outline">Stopped</Badge>
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <div className="flex justify-end items-center gap-2 mb-4">
        <Button variant="outline" size="icon" disabled={isLoading} onClick={refreshData}>
          {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : <RefreshCcwIcon className="size-4" />}
        </Button>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
