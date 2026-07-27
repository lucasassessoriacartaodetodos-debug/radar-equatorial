"use client";
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Trophy,
  Medal,
  Award,
} from "lucide-react";
import { STATUS_CONFIG, formatNumber, formatPercent, cn } from "@/lib/utils";
import type { DashboardFranquia } from "@/lib/types";

const columnHelper = createColumnHelper<DashboardFranquia>();

interface TabelaRankingProps {
  data: DashboardFranquia[];
  isLoading?: boolean;
}

export function TabelaRanking({ data, isLoading }: TabelaRankingProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "percentual_projecao", desc: true },
  ]);

  const rankedData = useMemo(() => {
    const sorted = [...data]
      .filter((f) => f.status !== "sem_meta" && f.status !== "sem_dados")
      .sort((a, b) => b.percentual_projecao - a.percentual_projecao);
    return sorted.map((item, idx) => ({ ...item, _posicao: idx + 1 }));
  }, [data]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("_posicao" as keyof DashboardFranquia, {
        header: "#",
        cell: (info) => {
          const pos = info.getValue() as number;
          const medalhas = ["text-yellow-400", "text-gray-300", "text-amber-700"];
          const MedalhaIcon = pos === 1 ? Medal : pos === 2 ? Award : pos === 3 ? Award : null;
          return (
            <div className="flex items-center">
              {MedalhaIcon ? (
                <MedalhaIcon className={cn("h-5 w-5", medalhas[pos - 1])} />
              ) : (
                <span className="text-sm font-bold text-graphite-400 w-5 text-center">
                  {pos}
                </span>
              )}
            </div>
          );
        },
        enableSorting: false,
        size: 44,
      }),
      columnHelper.accessor("franquia", {
        header: "Franquia",
        cell: (info) => (
          <span className="text-sm font-medium text-graphite-100">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("estado", {
        header: "UF",
        cell: (info) => (
          <span className="text-xs text-graphite-400">{info.getValue()}</span>
        ),
        size: 56,
      }),
      columnHelper.accessor("grupo", {
        header: "Grupo",
        cell: (info) => (
          <span className="text-xs text-graphite-300 uppercase">{info.getValue()}</span>
        ),
        size: 110,
      }),
      columnHelper.accessor("meta_operacional", {
        header: "Meta",
        cell: (info) => (
          <span className="text-sm text-graphite-300 text-right">
            {formatNumber(info.getValue())}
          </span>
        ),
        size: 90,
      }),
      columnHelper.accessor("producao_acumulada", {
        header: "Produção",
        cell: (info) => (
          <span className="text-sm text-graphite-300 text-right">
            {formatNumber(info.getValue())}
          </span>
        ),
        size: 90,
      }),
      columnHelper.accessor("percentual_atingido", {
        header: "% Atingido",
        cell: (info) => {
          const val = info.getValue();
          return (
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-semibold text-graphite-100">
                {formatPercent(val)}
              </span>
              <div className="w-20 h-1.5 bg-graphite-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-equatorial-orange to-equatorial-orange_soft"
                  style={{ width: `${Math.min(val, 100)}%` }}
                />
              </div>
            </div>
          );
        },
        size: 100,
      }),
      columnHelper.accessor("percentual_projecao", {
        header: "Projeção",
        cell: (info) => {
          const val = info.getValue();
          const projecaoValor = info.row.original.projecao;
          const status = info.row.original.status;
          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
          return (
            <div className="flex flex-col items-end gap-1">
              <span
                className="text-sm font-bold"
                style={{ color: config?.corHex }}
              >
                {formatPercent(val)}
              </span>
              <span className="text-[10px] text-graphite-500">
                {formatNumber(projecaoValor)} QIAS
              </span>
              <div className="w-20 h-1.5 bg-graphite-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(val, 100)}%`,
                    backgroundColor: config?.corHex,
                  }}
                />
              </div>
            </div>
          );
        },
        size: 110,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
          return (
            <div className="flex justify-center">
              <span className={config?.badgeClass}>
                <span className={cn("h-1.5 w-1.5 rounded-full", config?.dotColor)} />
                {config?.label}
              </span>
            </div>
          );
        },
        size: 110,
        enableSorting: false,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: rankedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Trophy className="h-5 w-5 text-graphite-500 animate-pulse" />
        </div>
      </Card>
    );
  }

  if (rankedData.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-sm text-graphite-500">
            Nenhuma franquia com dados de produção disponível.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-graphite-700"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-4 py-3 text-xs font-medium text-graphite-400 uppercase tracking-wider whitespace-nowrap"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "flex items-center gap-1 hover:text-graphite-200 transition-colors",
                            header.column.getCanSort() && "cursor-pointer",
                            header.column.getIsSorted() && "text-equatorial-orange"
                          )}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="ml-0.5">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronsUpDown className="h-3 w-3 opacity-40" />
                              )}
                            </span>
                          )}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-graphite-800 hover:bg-graphite-800/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2.5"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-graphite-400">
          <span>
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount() || 1}
          </span>
          <span className="text-graphite-600">|</span>
          <span>
            {table.getFilteredRowModel().rows.length} franquias
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg text-graphite-400 hover:text-graphite-100
                       hover:bg-graphite-800 transition-colors disabled:opacity-30
                       disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(table.getPageCount(), 5) }).map((_, i) => {
              const pageIndex = table.getState().pagination.pageIndex;
              const pageCount = table.getPageCount();
              let pageNum: number;
              if (pageCount <= 5) {
                pageNum = i;
              } else if (pageIndex < 2) {
                pageNum = i;
              } else if (pageIndex > pageCount - 3) {
                pageNum = pageCount - 5 + i;
              } else {
                pageNum = pageIndex - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => table.setPageIndex(pageNum)}
                  className={cn(
                    "h-7 w-7 rounded-lg text-xs font-medium transition-colors",
                    pageNum === pageIndex
                      ? "bg-equatorial-orange text-white"
                      : "text-graphite-400 hover:bg-graphite-800 hover:text-graphite-100"
                  )}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg text-graphite-400 hover:text-graphite-100
                       hover:bg-graphite-800 transition-colors disabled:opacity-30
                       disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}