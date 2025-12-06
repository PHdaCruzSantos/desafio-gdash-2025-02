import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import type { Response } from 'express';
import { ExportService } from './export.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalysisRequestDto } from './dto/analysis-request.dto';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly exportService: ExportService,
  ) {}

  @ApiOperation({ summary: 'Recebe dados do Worker e salva no banco' })
  @ApiResponse({ status: 201, description: 'Log climático criado com sucesso.' })
  @Post()
  create(@Body() createWeatherDto: CreateWeatherDto) {
    return this.weatherService.create(createWeatherDto);
  }

  @Get('export/csv')

  async exportCsv(@Res() res: Response) {
    try {
      const data = await this.weatherService.findAllForExport();
      if (!data) {
        return res.status(401).json({ message: 'CTLR: sem dados' });
      }
      const csvData = await this.exportService.generateCsv(data)
      if (!csvData) {
        return res.status(401).json({ message: 'CTLR: CSV Error na conversão' });
      }

      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="clima_exports.csv"',
      });
      res.send(csvData);
    } catch (erro) {
      res.status(500).json({
        message: 'Erro interno.',
        error: erro instanceof Error ? erro.message : String(erro),
      });
    }
  }
  @Get('export/xlsx')
  async exportXlsx(@Res() res: Response) {
    try {
      const data = await this.weatherService.findAllForExport();
      if (!data) {
        return res.status(401).json({ message: 'CTLR: sem dados' });
      }
      const bufferExcel = await this.exportService.generateXlsx(data)
      if (!bufferExcel) {
        return res.status(401).json({ message: 'CTLR: CSV Error na conversão' });
      }

      res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="clima_exports.xlsx"',
      'Content-Length': bufferExcel.byteLength.toString(),
    });
      res.send(bufferExcel);
    } catch (erro) {
      res.status(500).json({
        message: 'Erro interno.',
        error: erro instanceof Error ? erro.message : String(erro),
      });
    }
  }
  
  @Get('cities') // GET /weather/cities?q=Belo
  async searchCities(@Query('q') query: string) {
    return this.weatherService.searchCities(query);
  }

  @Post('analysis') 
  @ApiOperation({ summary: 'Gera um insight de IA sob demanda' })
  async generateAnalysis(@Body() dto: AnalysisRequestDto) {
    return this.weatherService.requestAnalysis(dto);
  }

  @Get('current')
  async getCurrentWeather(@Query('city') city: string) {
    if (!city) return { error: 'Cidade obrigatória' };
    return this.weatherService.getCurrentWeatherForCity(city);
  }

  @Get()
  @ApiOperation({ summary: 'Lista os últimos 100 registros' })
  findAll() {
    return this.weatherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weatherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeatherDto: UpdateWeatherDto) {
    return this.weatherService.update(+id, updateWeatherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weatherService.remove(+id);
  }
}
