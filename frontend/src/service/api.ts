import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,  
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
  collected_at: number; 
  createdAt: string;    
}

export const AnalysisContext = {
  GENERAL: 'general',
  HEALTH: 'health',
  ACTIVITY: 'activity',
  OUTFIT: 'outfit',
} as const;

export type AnalysisContext = (typeof AnalysisContext)[keyof typeof AnalysisContext];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gdash_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    console.log("User login")
    console.table(response.data)
    return response.data; 
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/users', { name, email, password });
    return response.data;
  },
};

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  description?: string;
  photo?: string;
}

export const UserService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },
  create: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  updateProfile: async (id: string, data: { name?: string; email?: string; password?: string; description?: string }) => {
    if (!data.password) delete data.password;
    
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },
  uploadAvatar: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  delete: async (id: string, password?: string) => {
    await api.delete(`/users/${id}`, { data: { password } });
  },
};


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
  },
  getAnalysis: async (context: AnalysisContext, city?: string) => {
    const response = await api.post('/weather/analysis', { context, city });
    return response.data;
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