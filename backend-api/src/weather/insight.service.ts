import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisContext } from './dto/analysis-request.dto'; // Importe o Enum

@Injectable()
export class InsightService {
  private genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(InsightService.name);

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async generateAnalysis(
    city: string, 
    currentData: string, 
    historicalContext: string,
    context: AnalysisContext = AnalysisContext.GENERAL 
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

      // Seleciona a persona baseada no contexto
      let personaInstruction = "Aja como um meteorologista.";
      if (context === AnalysisContext.HEALTH) personaInstruction = "Aja como um consultor de saúde focado em clima.";
      if (context === AnalysisContext.OUTFIT) personaInstruction = "Aja como um consultor de moda focado em clima.";
      if (context === AnalysisContext.ACTIVITY) personaInstruction = "Aja como um treinador esportivo.";

      const prompt = `
        ${personaInstruction}
        Local: ${city}
        Contexto Solicitado: ${context.toUpperCase()}
        
        HISTÓRICO (Últimas horas):
        ${historicalContext || "Sem dados históricos."}
        
        AGORA:
        ${currentData}
        
        Tarefa: Forneça um insight curto, útil e direto (máx 30 palavras) focado EXCLUSIVAMENTE no contexto solicitado (${context}) e analisando o hotóroco de temperaturas.
        Não repita os dados técnicos, dê a conclusão prática.
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 100, temperature: 0.7 },
      });

      const response = await result.response;
      return response.text();

    } catch (error) {
      this.logger.error('Erro Gemini:', error);
      return 'Não foi possível gerar a análise no momento.';
    }
  }
}