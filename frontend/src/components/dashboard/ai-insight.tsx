import { Sparkles, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AiInsightCardProps {
  insight?: string
}

export function AiInsightCard({ insight }: AiInsightCardProps) {
  return (
    <Card className="col-span-full border-indigo-500/20 bg-gradient-to-r from-indigo-50/50 to-background dark:from-indigo-950/10 dark:to-background shadow-sm relative overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
        <Sparkles className="h-48 w-48 text-indigo-500 rotate-12" />
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <Sparkles className="h-5 w-5" /> Análise Inteligente (Gemini AI)
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col gap-4">
          <p className="text-base md:text-lg leading-relaxed text-foreground/90 font-medium">
            {insight || "Aguardando análise da inteligência artificial..."}
          </p>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="text-indigo-500 border-indigo-200 bg-indigo-50 dark:bg-indigo-950/30">
                <TrendingUp className="h-3 w-3 mr-1" /> Tendência de 5h
            </Badge>
            <Badge variant="outline" className="border-border">
                Atualizado em tempo real
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}