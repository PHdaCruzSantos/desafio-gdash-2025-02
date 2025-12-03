import { 
  Area, AreaChart, Bar, BarChart, Line, LineChart, 
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import type { WeatherLog } from "@/service/api"

interface ChartsGridProps {
  data: WeatherLog[]
}

export function ChartsGrid({ data }: ChartsGridProps) {
  const chartData = [...data].reverse().map((log) => ({
    time: new Date(log.collected_at * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    temp: log.temp,
    feels: log.feels_like,
    humidity: log.humidity,
    wind: (log as any).wind_speed || 0,
    pressure: (log as any).pressure || 1013,
  }))

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    borderColor: "hsl(var(--border))",
    borderRadius: "var(--radius)",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    fontSize: "12px",
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 col-span-full">
      
      <Card className="col-span-1 lg:col-span-7 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Temperatura & Sensação</CardTitle>
          <CardDescription>Evolução térmica (°C)</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              
              <XAxis 
                dataKey="time" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10} 
                fontSize={11} 
                stroke="hsl(var(--muted-foreground))"
                minTickGap={40} 
              />
              
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v}°`} fontSize={11} stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "hsl(var(--foreground))" }} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              <Area type="monotone" dataKey="temp" name="Temperatura" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
              <Area type="monotone" dataKey="feels" name="Sensação" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-3 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Pressão</CardTitle>
          <CardDescription>Atmosférica (hPa)</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10} 
                fontSize={11} 
                stroke="hsl(var(--muted-foreground))"
                minTickGap={40}
              />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{display: 'none'}} />
              
              <Line type="monotone" dataKey="pressure" name="Pressão" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      
      <Card className="col-span-1 lg:col-span-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Umidade Relativa</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              
              <XAxis 
                dataKey="time" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10} 
                fontSize={11} 
                stroke="hsl(var(--muted-foreground))"
                minTickGap={40}
              />

              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tooltipStyle} cursor={{fill: 'hsl(var(--muted)/0.2)'}} />
              
              <Bar dataKey="humidity" name="Umidade (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Velocidade do Vento</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              
              <XAxis 
                dataKey="time" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10} 
                fontSize={11} 
                stroke="hsl(var(--muted-foreground))"
                minTickGap={40}
              />

              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tooltipStyle} />
              
              <Line type="step" dataKey="wind" name="Vento (m/s)" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  )
}