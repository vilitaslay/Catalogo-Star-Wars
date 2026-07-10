import { Test, TestingModule } from '@nestjs/testing';
import { SwapiService, mapper } from './swapi.service';

describe('SwapiService', () => {
  let service: SwapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwapiService],
    }).compile();

    service = module.get<SwapiService>(SwapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('mapper', () => {
  it('debería mapear correctamente cada campo en el json respuesta de SWAPI a forma de Pelicula', () => {
    const fakeItem = {
      uid: '1',
      description: 'A Star Wars Film',
      properties: {
        title: 'A New Hope',
        episode_id: 4,
        director: 'George Lucas',
        release_date: '1977-05-25',
        opening_crawl: 'It is a period of civil war...',
      },
    };

    const result = mapper(fakeItem);

    expect(result.swapiId).toBe(1);
    expect(typeof result.swapiId).toBe('number');
    expect(result.titulo).toBe('A New Hope');
    expect(result.episodio).toBe(4);
    expect(result.director).toBe('George Lucas');
    expect(result.crawl_apertura).toBe('It is a period of civil war...');
    expect(result.descripcion).toBe('A Star Wars Film');
    expect(result.fecha_estreno).toBe(new Date('1977-05-25').toISOString());
  });

  it('debería manejar pelis con mismo título distintos valores', () => {
    const fakeItem = {
      uid: '5',
      description: 'A Star Wars Film',
      properties: {
        title: 'Attack of the Clones',
        episode_id: 2,
        director: 'George Lucas',
        release_date: '2002-05-16',
        opening_crawl: 'There is unrest...',
      },
    };

    const result = mapper(fakeItem);

    expect(result.swapiId).toBe(5);
    expect(result.titulo).toBe('Attack of the Clones');
    expect(result.episodio).toBe(2);
    expect(result.fecha_estreno).toBe(new Date('2002-05-16').toISOString());
  });
});
