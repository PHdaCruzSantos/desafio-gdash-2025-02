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

export interface PokemonListResponse {
  data: { name: string; url: string }[];
  total: number;
  totalPages: number;
}

export interface PokemonDetails {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  stats: { base_stat: number; stat: { name: string } }[];
}

export const PokemonService = {
  // Busca a lista paginada
  getAll: async (page = 1, limit = 12): Promise<PokemonListResponse> => {
    const response = await api.get<PokemonListResponse>('/pokemon', {
      params: { page, limit },
    });
    return response.data;
  },

  // Busca detalhes de UM pokémon pelo nome ou ID
  getDetails: async (idOrName: string | number): Promise<PokemonDetails> => {
    const response = await api.get<PokemonDetails>(`/pokemon/${idOrName}`);
    return response.data;
  },
};