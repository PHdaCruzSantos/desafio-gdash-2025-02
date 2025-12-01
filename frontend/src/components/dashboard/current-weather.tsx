import { Thermometer, Droplets, Wind } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { WeatherLog } from "@/service/api"

interface CurrentWeatherProps {
  data?: WeatherLog
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Card Principal de Temperatura - Ocupa 2 espaços */}
      <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-primary" /> Temperatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-primary">
            {data?.temp?.toFixed(1)}°C
          </div>
          <p className="text-sm text-muted-foreground mt-2 capitalize font-medium">
            {data?.description} • Sensação {data?.feels_like?.toFixed(1)}°C
          </p>
        </CardContent>
      </Card>

      {/* Cards Menores */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
             <Droplets className="h-4 w-4" /> Umidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{data?.humidity}%</div>
          <p className="text-xs text-muted-foreground mt-1">Umidade relativa do ar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
             <Wind className="h-4 w-4" /> Vento
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Casting 'as any' pois o campo wind_speed é opcional no DTO base */}
          <div className="text-3xl font-bold">{(data as any)?.wind_speed || 0} <span className="text-sm font-normal text-muted-foreground">m/s</span></div>
          <p className="text-xs text-muted-foreground mt-1">Velocidade do vento</p>
        </CardContent>
      </Card>
    </div>
  )
}