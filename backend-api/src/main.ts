import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Desafio técnico GDASH Weather API')
    .setDescription('Documentação da API de monitoramento climático')
    .setVersion('1.0')
    .addTag('wather', 'Endpoint relacionados a dados climatico')
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('weather/docs', app, document);


  await app.listen(3000);
}
bootstrap();
