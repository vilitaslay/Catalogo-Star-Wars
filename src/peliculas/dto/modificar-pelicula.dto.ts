import { PartialType } from '@nestjs/mapped-types';
import { CrearPeliculaDto} from './crear-pelicula.dto';

// modificar una peli requiere un subconjunto de los atributos para crearla
export class ModPeliculaDto extends PartialType(CrearPeliculaDto) {}

// y eliminarla lo mismo
export class DelPeliculaDto extends PartialType(CrearPeliculaDto) {}