import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  
  generateCsv(data: any[]): string {
    if (!data || data.length === 0) return '';

    const fields = [
      { label: 'Cidade', value: 'city' },
      { label: 'Temp (°C)', value: 'temp' },
      { label: 'Sensação (°C)', value: 'feels_like' },
      { label: 'Umidade (%)', value: 'humidity' },
      { label: 'Condição', value: 'description' },
      {
        label: 'Data Coleta',
        value: (row: any) =>
          row.collected_at
            ? new Date(row.collected_at * 1000).toLocaleString('pt-BR')
            : '',
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const json2csvParser = new Parser({ fields });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    return json2csvParser.parse(data);
  }

    async generateXlsx(data: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Histórico de Clima');

    worksheet.columns = [
      { header: 'Cidade', key: 'city', width: 20 },
      { header: 'Temp (°C)', key: 'temp', width: 10 },
      { header: 'Sensação', key: 'feels_like', width: 10 },
      { header: 'Umid. (%)', key: 'humidity', width: 10 },
      { header: 'Condição', key: 'description', width: 20 },
      { header: 'Data Coleta', key: 'collected_at', width: 20 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'fefedf' }, 
    };

    
    data.forEach((log) => {
      worksheet.addRow({
        city: log.city,
        temp: log.temp,
        feels_like: log.feels_like,
        humidity: log.humidity,
        description: log.description,
        collected_at: log.collected_at
          ? new Date(log.collected_at * 1000).toLocaleString('pt-BR')
          : '',
      });
    });

    const ret = (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
    return ret;
  }
}