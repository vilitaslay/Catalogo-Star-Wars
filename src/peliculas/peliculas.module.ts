import { Module } from '@nestjs/common';
import { PeliculasController } from './peliculas.controller';
import { PeliculasService } from './peliculas.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SwapiService } from 'src/swapi/swapi.service';
import { SwapiModule } from 'src/swapi/swapi.module';

@Module({
    imports: [PrismaModule, SwapiModule],
    controllers: [PeliculasController],
    providers: [PeliculasService],
})
export class PeliculasModule {}
