import { useEffect, useState } from "react"
import { WeatherService } from "@/service/api"
import type {  WeatherLog } from "@/service/api"
import { Skeleton } from "@/components/ui/skeleton"

import { DashboardHeader } from "@/components/dashboard/header"
import { CurrentWeather } from "@/components/dashboard/current-weather"
import { AiInsightCard } from "@/components/dashboard/ai-insight"
import { HistoryTable } from "@/components/dashboard/history-table"
import { ChartsGrid } from "@/components/dashboard/chart-grid"

const UPDATE_INTERVAL_SECONDS = 300;

export function DashboardPage() {
  const [logs, setLogs] = useState<WeatherLog[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(UPDATE_INTERVAL_SECONDS)

  const fetchData = async (isBackground = false) => {
    if (!isBackground) setLoading(true)
    try {
      const data = await WeatherService.getAll()
      setLogs(data)
      setTimeLeft(UPDATE_INTERVAL_SECONDS)
    } catch (error) {
      console.error("Erro ao buscar dados", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          fetchData(true) 
          return UPDATE_INTERVAL_SECONDS
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const current = logs[0]

  if (loading && logs.length === 0) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        cityName={current?.city} 
        timeLeft={timeLeft} 
      />

      <div className="grid gap-6">
        <AiInsightCard />
        
        <CurrentWeather data={current} />

        <ChartsGrid data={logs} />
        
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