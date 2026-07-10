import { Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Pelicula } from '@prisma/client';
import { CrearPeliculaDto } from './dto/crear-pelicula.dto';
import { ModPeliculaDto } from './dto/modificar-pelicula.dto';
import { mapper, SwapiService } from '../swapi/swapi.service';


@Injectable()
export class PeliculasService {

    constructor(
        private prisma: PrismaService,
        private swapi: SwapiService
    ){}

    async buscador(titulo?: string) {
        return this.prisma.pelicula.findMany({
            where: titulo ? { titulo: { contains: titulo, mode: 'insensitive' } } : undefined,
            select: { id: true, titulo: true },
        });
    }

    async traerPeliculas() {
        return this.prisma.pelicula.findMany({select: {id: true, titulo: true}});
    }

    async traerPelicula(id: string): Promise<Pelicula> {
        const pelicula = await this.prisma.pelicula.findUnique({ where: { id } });
        if (!pelicula) {
          throw new NotFoundException(/* no pudimos encontrar la peli que buscabas :(*/);
        }
        return pelicula;
    }

    async agregarPelicula(dto: CrearPeliculaDto): Promise<Pelicula> {
        // aca no me fijo si existe porque hicieron "Funny Girl" tres veces ponele
        return this.prisma.pelicula.create({data: dto})
    }

    async modificarPelicula(id: string, dto: ModPeliculaDto) {
        // a ver si la peli que queres modificar existe
        await this.traerPelicula(id);
        const update = await this.prisma.pelicula.update({
            where: {
                id
            }, 
            data: dto
        })
        return update;
    }

    async eliminarPelicula(id: string) {
        // aca no me fijo si existe porque hicieron "Funny Girl" tres veces ponele
        await this.traerPelicula(id);
        return this.prisma.pelicula.delete({where: {id}})
    }

    async syncSwapi() {
        const peliculas = await this.swapi.bringData()
        for (const item of peliculas) {
            const dto = mapper(item);
            await this.prisma.pelicula.upsert({
              where: { swapiId: dto.swapiId },
              update: dto,
              create: dto,
            });
        }
    }
}
