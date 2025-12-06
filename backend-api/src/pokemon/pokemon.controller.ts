import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@ApiTags('pokemon')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
    @Query('type') type?: string, // <--- O parâmetro TEM que estar aqui
  ) {
    // SE tiver tipo E não for 'all', chama o serviço específico
    if (type && type !== 'all') {
      return this.pokemonService.findByType(type, +page, +limit);
    }
    // Senão, chama o geral
    return this.pokemonService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de um Pokémon específico' })
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }

}