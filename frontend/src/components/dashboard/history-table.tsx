import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { WeatherLog } from "@/service/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface HistoryTableProps {
  data: WeatherLog[]
}

const ITEMS_PER_PAGE = 10

export function HistoryTable({ data }: HistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentData = data.slice(startIndex, endIndex)

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico Recente</CardTitle>
        <CardDescription>Últimos registros coletados ({data.length} total).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Condição</TableHead>
                <TableHead>Temp.</TableHead>
                <TableHead>Umidade</TableHead>
                {/* <TableHead className="hidden md:table-cell">Insight IA (Resumo)</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {log.collected_at 
                      ? new Date(log.collected_at * 1000).toLocaleString('pt-BR') 
                      : "-"}
                  </TableCell>
                  <TableCell className="capitalize">
                    <Badge variant="secondary">{log.description}</Badge>
                  </TableCell>
                  <TableCell>{log.temp}°C</TableCell>
                  <TableCell>{log.humidity}%</TableCell>
                  {/* <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[300px] truncate">
                    {log.ai_insight || "-"}
                  </TableCell> */}
                </TableRow>
              ))}
              {currentData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum dado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Próximo <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}