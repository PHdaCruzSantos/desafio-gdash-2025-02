import { useState } from "react"
import { Sparkles, Activity, Shirt, Stethoscope, MessageSquare, Bot } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WeatherService, AnalysisContext } from "@/service/api"
import { Skeleton } from "@/components/ui/skeleton"

export function AiInsightCard() {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeContext, setActiveContext] = useState<AnalysisContext | null>(null)

  const requestInsight = async (context: AnalysisContext) => {
    setLoading(true)
    setActiveContext(context)
    setInsight(null) // Limpa o texto anterior para dar feedback visual
    try {
      const response = await WeatherService.getAnalysis(context)
      setInsight(response.insight)
    } catch (error) {
      setInsight("Não foi possível conectar com a IA no momento.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="col-span-full border-primary/20 bg-gradient-to-r from-primary/5 to-background shadow-sm relative overflow-hidden transition-all duration-500">
      
      {/* Decoração de fundo */}
      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
        <Bot className="h-32 w-32 text-primary -rotate-12" />
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
          <Sparkles className="h-5 w-5" /> Consultor Climático IA (Gemini)
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col gap-4">
          
          <p className="text-sm text-muted-foreground">
            Selecione um tópico para gerar uma análise personalizada em tempo real:
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-2 z-10">
            <Button 
              variant={activeContext === AnalysisContext.GENERAL ? "default" : "outline"}
              size="sm" 
              onClick={() => requestInsight(AnalysisContext.GENERAL)}
              disabled={loading}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Resumo
            </Button>

            <Button 
              variant={activeContext === AnalysisContext.HEALTH ? "default" : "outline"}
              size="sm" 
              onClick={() => requestInsight(AnalysisContext.HEALTH)}
              disabled={loading}
              // Estilização customizada para Saúde (Vermelho suave) quando ativo
              className={activeContext === AnalysisContext.HEALTH ? "bg-rose-500 hover:bg-rose-600 text-white border-none" : "gap-2"}
            >
              <Stethoscope className="w-4 h-4" /> Saúde
            </Button>

            <Button 
              variant={activeContext === AnalysisContext.ACTIVITY ? "default" : "outline"}
              size="sm" 
              onClick={() => requestInsight(AnalysisContext.ACTIVITY)}
              disabled={loading}
              className={activeContext === AnalysisContext.ACTIVITY ? "bg-emerald-500 hover:bg-emerald-600 text-white border-none" : "gap-2"}
            >
              <Activity className="w-4 h-4" /> Esportes
            </Button>

            <Button 
              variant={activeContext === AnalysisContext.OUTFIT ? "default" : "outline"}
              size="sm" 
              onClick={() => requestInsight(AnalysisContext.OUTFIT)}
              disabled={loading}
              className={activeContext === AnalysisContext.OUTFIT ? "bg-violet-500 hover:bg-violet-600 text-white border-none" : "gap-2"}
            >
              <Shirt className="w-4 h-4" /> Vestimenta
            </Button>
          </div>

          {/* Área de Resposta (Display) */}
          <div className="min-h-[80px] p-4 rounded-lg bg-background/50 border border-border/50 shadow-inner relative">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : insight ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-base leading-relaxed font-medium text-foreground">
                  {insight}
                </p>
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                   <Bot className="w-3 h-3" /> Gerado por IA agora mesmo.
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground italic gap-2">
                <Bot className="w-4 h-4" />
                <span>O assistente está aguardando sua pergunta...</span>
              </div>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  )
}