import { Injectable } from '@nestjs/common';
import { CrearPeliculaDto } from 'src/peliculas/dto/crear-pelicula.dto';

const SWAPI_BASE = "https://www.swapi.tech/api/";

export function mapper(item: any) {
    return {
      swapiId: parseInt(item.uid, 10),
      titulo: item.properties.title,
      episodio: item.properties.episode_id,
      director: item.properties.director,
      fecha_estreno: new Date(item.properties.release_date).toISOString(),
      crawl_apertura: item.properties.opening_crawl,
      descripcion: item.description    
    };
}

@Injectable()
export class SwapiService {

    async bringData(): Promise<any> {
        const res = await fetch(SWAPI_BASE + "films");
        const data = await res.json()
        return data.result
    }

}
