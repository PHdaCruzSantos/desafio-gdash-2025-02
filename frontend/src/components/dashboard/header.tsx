import { useEffect, useState } from "react"
import { Download, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WeatherService } from "@/service/api"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  cityName?: string
  onRefresh: () => void
}

const UPDATE_INTERVAL_SECONDS = 300;

export function DashboardHeader({ cityName, onRefresh }: DashboardHeaderProps) {
  const [timeLeft, setTimeLeft] = useState(UPDATE_INTERVAL_SECONDS)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          onRefresh()
          return UPDATE_INTERVAL_SECONDS
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onRefresh])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-2">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Dashboard Climático</h2>
        <p className="text-muted-foreground">
          Monitoramento em tempo real de <span className="font-semibold text-foreground">{cityName || "..."}</span>
        </p>
      </div>
      
      <div className="flex gap-2 items-center">
        
        <Badge variant="outline" className="h-12 px-4 gap-2 text-sm font-normal border-primary/20 bg-primary/5 text-muted-foreground">
          <Clock className="h-4 w-4 text-primary animate-pulse" />
          <span>Próxima coleta em:</span>
          <span className="font-mono font-bold text-foreground">{formatTime(timeLeft)}</span>
        </Badge>

        <div className="h-6 w-px bg-border mx-1 hidden md:block" />

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