import { Test, TestingModule } from '@nestjs/testing';
import { PeliculasService } from './peliculas.service';
import { PrismaService } from '../prisma/prisma.service';
import { SwapiService } from '../swapi/swapi.service';
import { NotFoundException } from '@nestjs/common';

describe('PeliculasService', () => {
  let service: PeliculasService;
  let prisma: any;
  let swapi: any;

  beforeEach(async () => {
    prisma = {
      pelicula: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        upsert: jest.fn(),
      },
    };

    swapi = {
      bringData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeliculasService,
        { provide: PrismaService, useValue: prisma },
        { provide: SwapiService, useValue: swapi },
      ],
    }).compile();

    service = module.get<PeliculasService>(PeliculasService);
  });

  describe('traerPeliculas', () => {
    it('debería devolver una lista de IDs y títulos', async () => {
      prisma.pelicula.findMany.mockResolvedValue([{ id: '1', titulo: 'A New Hope' }]);

      const result = await service.traerPeliculas();

      expect(result).toEqual([{ id: '1', titulo: 'A New Hope' }]);
      expect(prisma.pelicula.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ select: { id: true, titulo: true } }),
      );
    });

  });

  describe('traerPelicula', () => {
    it('debería devolver un único item', async () => {
      const pelicula = { id: '1', titulo: 'A New Hope' };
      prisma.pelicula.findUnique.mockResolvedValue(pelicula);

      const result = await service.traerPelicula('1');

      expect(result).toEqual(pelicula);
    });

    it('debería no encontrar este token fake en la base', async () => {
      prisma.pelicula.findUnique.mockResolvedValue(null);

      await expect(service.traerPelicula('fake-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('agregarPelicula', () => {
    it('debería crear una instancia de Película válida', async () => {
      const dto = { titulo: 'Bee Movie', descripcion: 'test' };
      prisma.pelicula.create.mockResolvedValue({ id: '1', ...dto });

      const result = await service.agregarPelicula(dto as any);

      expect(prisma.pelicula.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual({ id: '1', ...dto });
    });
  });

  describe('modificarPelicula', () => {
    it('debería modificar cuando una peli existe', async () => {
      prisma.pelicula.findUnique.mockResolvedValue({ id: '1', titulo: 'Old' });
      prisma.pelicula.update.mockResolvedValue({ id: '1', titulo: 'New' });

      const result = await service.modificarPelicula('1', { titulo: 'New' } as any);

      expect(prisma.pelicula.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { titulo: 'New' },
      });
      expect(result.titulo).toBe('New');
    });

    it('debería arrojar excepción si no existe la peli que se quiere modificar', async () => {
      prisma.pelicula.findUnique.mockResolvedValue(null);

      await expect(
        service.modificarPelicula('fake-id', { titulo: 'New' } as any),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.pelicula.update).not.toHaveBeenCalled();
    });
  });

  describe('eliminarPelicula', () => {
    it('debería borrar la peli en cuestión de la base', async () => {
      prisma.pelicula.findUnique.mockResolvedValue({ id: '1', titulo: 'Bee Movie' });
      prisma.pelicula.delete.mockResolvedValue({ id: '1', titulo: 'Bee Movie' });

      const result = await service.eliminarPelicula('1');

      expect(prisma.pelicula.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual({ id: '1', titulo: 'Bee Movie' });
    });

    it('debería arrojar excepción si se quiere borrar una película que no existe', async () => {
      prisma.pelicula.findUnique.mockResolvedValue(null);

      await expect(service.eliminarPelicula('fake-id')).rejects.toThrow(NotFoundException);
      expect(prisma.pelicula.delete).not.toHaveBeenCalled();
    });
  });

  describe('syncSwapi', () => {
    it('debería sincronizar los datos de película con la base de datos', 
      async () => {
      swapi.bringData.mockResolvedValue([
        {
          uid: '1',
          description: 'A Star Wars Film',
          properties: {
            title: 'A New Hope',
            episode_id: 4,
            director: 'George Lucas',
            release_date: '1977-05-25',
            opening_crawl: '...',
          },
        },
      ]);
      prisma.pelicula.upsert.mockResolvedValue({});

      await service.syncSwapi();

      expect(prisma.pelicula.upsert).toHaveBeenCalledTimes(1);
      expect(prisma.pelicula.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { swapiId: 1 },
        }),
      );
    });
  });

  describe('buscador', () => {
    it('debería encontrar todos los títulos con esa subcadena', async () => {
        prisma.pelicula.findMany.mockResolvedValue([]);

        await service.buscador('of');

        expect(prisma.pelicula.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { titulo: { contains: 'of', mode: 'insensitive' } },
          }),
        );
      });
  });
});