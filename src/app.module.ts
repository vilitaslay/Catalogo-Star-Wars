import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeliculasModule } from './peliculas/peliculas.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { SwapiService } from './swapi/swapi.service';
import { SwapiModule } from './swapi/swapi.module';

@Module({
  imports: [PeliculasModule, AuthModule, PrismaModule, SwapiModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, SwapiService],
})
export class AppModule {}
