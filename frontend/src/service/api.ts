import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,  //5s, cancela
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface WeatherLog {
  _id: string;
  city: string;
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  ai_insight?: string;
  collected_at: number; // Timestamp Unix
  createdAt: string;    // Data ISO do Mongo
}

// Serviço dedicado ao Clima (Organização)
export const WeatherService = {
  getAll: async (): Promise<WeatherLog[]> => {
    const response = await api.get<WeatherLog[]>('/weather');
    return response.data;
  },

  exportCsv: () => {
    window.open('http://localhost:3000/weather/export/csv', '_blank');
  },
  
  exportXlsx: () => {
    window.open('http://localhost:3000/weather/export/xlsx', '_blank');
  }
};