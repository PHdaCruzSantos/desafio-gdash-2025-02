import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    // Conecta usando a variável de ambiente definida no docker-compose
    MongooseModule.forRoot(process.env.MONGO_URI!),
    WeatherModule,
    PokemonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
