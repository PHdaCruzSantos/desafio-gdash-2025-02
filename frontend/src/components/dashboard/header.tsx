import { RefreshCw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WeatherService } from "@/service/api"

interface DashboardHeaderProps {
  cityName?: string
  onRefresh: () => void
  loading: boolean
}

export function DashboardHeader({ cityName, onRefresh, loading }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-2">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Dashboard Climático</h2>
        <p className="text-muted-foreground">
          Monitoramento em tempo real de <span className="font-semibold text-foreground">{cityName || "..."}</span>
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 
          Atualizar
        </Button>
        <Button variant="secondary" onClick={() => WeatherService.exportCsv()}>
          <Download className="mr-2 h-4 w-4" /> CSV
        </Button>
        <Button variant="secondary" onClick={() => WeatherService.exportXlsx()}>
          <Download className="mr-2 h-4 w-4" /> Excel
        </Button>
      </div>
    </div>
  )
}