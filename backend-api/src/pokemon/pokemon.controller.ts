import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('pokemon') // Para ficar bonito no Swagger
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiOperation({ summary: 'Lista Pokémons com paginação' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    // Convertendo string da query para number
    return this.pokemonService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de um Pokémon específico' })
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }

}