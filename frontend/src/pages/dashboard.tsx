import { useEffect, useState } from "react"
import { WeatherService } from "@/service/api"
import type {WeatherLog} from '@/service/api'
import { Skeleton } from "@/components/ui/skeleton"

// Import dos Componentes Modulares
import { DashboardHeader } from "@/components/dashboard/header"
import { CurrentWeather } from "@/components/dashboard/current-weather"
import { AiInsightCard } from "@/components/dashboard/ai-insight"
import { HistoryTable } from "@/components/dashboard/history-table"

export function DashboardPage() {
  const [logs, setLogs] = useState<WeatherLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await WeatherService.getAll()
      setLogs(data)
    } catch (error) {
      console.error("Erro ao buscar dados", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const current = logs[0]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        cityName={current?.city} 
        onRefresh={fetchData} 
        loading={loading}
      />

      <div className="grid gap-6">
        {/* IA em destaque no topo */}
        <AiInsightCard insight={current?.ai_insight} />
        
        {/* Cards de Métricas */}
        <CurrentWeather data={current} />
        
        {/* Tabela Paginada */}
        <HistoryTable data={logs} />
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid gap-4 md:grid-cols-4">
        <Skeleton className="h-32 rounded-xl col-span-2" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}