import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PokemonService {
  private readonly BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

  // Buscamos pokemons com Paginação
  async findAll(page: number = 1, limit: number = 20) {
    try {
      // Cálculo do Offset (Pulo):
      // Página 1: offset 0
      // Página 2: offset 20
      const offset = (page - 1) * limit;

      const response = await axios.get(this.BASE_URL, {
        params: { offset, limit },
      });

      // Retornamos os dados brutos da PokéAPI
      // Ela retorna: { count: 1300, next: "url...", results: [...] }
      return {
        data: response.data.results,
        total: response.data.count,
        page,
        limit,
        totalPages: Math.ceil(response.data.count / limit),
      };
    } catch (error) {
      console.error('Erro PokéAPI:', error);
      throw new HttpException(
        'Falha ao buscar Pokémons',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // Busca detalhes de UM Pokémon (para o futuro, se quiser um modal de detalhes)
  async findOne(id: number | string) {
    try {
      const response = await axios.get(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new HttpException('Pokémon não encontrado', HttpStatus.NOT_FOUND);
    }
  }

  async findByType(type: string, page: number = 1, limit: number = 20) {
    try {
      // O endpoint de type retorna TODOS os pokemons daquele tipo de uma vez
      const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
      const allPokemons = response.data.pokemon.map((p: any) => p.pokemon);

      // Paginação manual em memória
      const total = allPokemons.length;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;
      
      const paginated = allPokemons.slice(offset, offset + limit);

      return {
        data: paginated,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('Erro PokéAPI Type:', error);
      throw new HttpException(
        'Falha ao buscar Pokémons por tipo',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // Métodos CRUD padrão que não vamos usar (pode apagar ou deixar vazio)
  update(id: number, updatePokemonDto: any) { return `Action not allowed`; }
  remove(id: number) { return `Action not allowed`; }
  create(createPokemonDto: any) { return `Action not allowed`; }
}