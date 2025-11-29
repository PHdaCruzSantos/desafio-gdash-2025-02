import { Injectable, Logger } from "@nestjs/common";
import { GoogleGenerativeAI } from '@google/generative-ai'


@Injectable()
export class InsightService {
  private genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(InsightService.name);

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_APY_KEY!)
  }

  async generateWeatherAnalysis(
    city: string,
    currentData: string,
    historicalContext: string
  ) : Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({model: 'gemini-2.5-flash-lite'});

      const prompt = `
        Aja como um metorologista profissional expeiente.
        Local: ${city}

        CONTEXTO HISTÓRICO (Últimas horas):
        ${historicalContext || "Sem dados históricos."}

        CONDIÇÃO ATUAL:
        ${currentData}

        Tarefa: Identifique a tendência climática (ex: pressão caindo, humidade abaixando, esquentando) e dê uma recomendação(insigth) curta (máx 20 palavras).
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{text: prompt}] }],
        generationConfig: {maxOutputTokens: 60, temperature: 0.7},
      });
      const response = await result.response;
      const text = response.text();

      this.logger.log(`Insigth Gerado: ${text}`);
      return text;
    } catch(error) {
      this.logger.error('Falha ao gerar insigth', error);
      return 'Análise indiponivel no momento.';
    }
  }
}