import { Controller, Get, Post, Param, Body , Query , Patch, Delete, UseGuards, applyDecorators} from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { CrearPeliculaDto } from './dto/crear-pelicula.dto';
import { ModPeliculaDto } from './dto/modificar-pelicula.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';


// me pareció más comodo y legible
export function Allow(type: string[]) {
  return applyDecorators(
    ApiBearerAuth(),
    Roles(...type),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}

@ApiTags('Peliculas 🎥')
@Controller('peliculas')
export class PeliculasController {
    constructor(private peliculasService: PeliculasService) {}
    
    @ApiOperation({ summary: 'Traer todas las películas', description: 'Con este endpoint podemos solicitar todas las peliculas en la base. \n Para mayor claridad se devuelve solamente los IDs y los títulos de las película. \n Con esos IDs podremos luego hacer requests al endpoint de busqueda específica.' })
    @Get()
    traerPeliculas() {
      return this.peliculasService.traerPeliculas();
    }

    @ApiOperation({ summary: 'Buscador de películas', description: 'Con este endpoint podemos solicitar películas en base a coincidencia en el título. \n Ejemplo: para titulo="of" se encuentran 3 peliculas ("Attack of the Clones", "Revenge of the Sith", "Return of the Jedi"). [REQUIERE LOGIN]' })
    @Allow(['REGULAR', 'ADMINISTRADOR'])
    @Get('buscar')
    buscador(@Query('titulo') titulo?: string) {
      return this.peliculasService.buscador(titulo);
    }

    @ApiOperation({ summary: 'Traer una película', description: 'Con este endpoint podemos solicitar la información completa almacenada en la base para una dado el ID de una película. [REQUIERE LOGIN]' })
    @Allow(['REGULAR'])
    @Get(':id')
    traerPelicula(@Param('id') id: string) {
      return this.peliculasService.traerPelicula(id);
    }

    @ApiOperation({ summary: 'Agregar una película', description: 'Con este endpoint podemos CREAR una entrada nueva en la tabla "Peliculas" de la base de datos. Muchos campos pueden ser NULLeables pero se provee la estructura en caso de querer completarlos. [ACCIÓN SOLO PARA ADMINISTRADORES]' })
    @Allow(["ADMINISTRADOR"])
    @Post()
    agregarPelicula(@Body() dto: CrearPeliculaDto) {
      return this.peliculasService.agregarPelicula(dto);
    }

    @ApiOperation({ summary: 'Modificar una película', description: 'Con este endpoint podemos MODIFICAR una entrada en la tabla "Peliculas" de la base de datos. Proveyendo el ID de la película se pueden editar uno o varios campos de la misma. [ACCIÓN SOLO PARA ADMINISTRADORES]' })
    @Allow(["ADMINISTRADOR"])
    @Patch(":id")
    modificarPelicula( @Param('id') id: string, @Body() dto: ModPeliculaDto){
        return this.peliculasService.modificarPelicula(id, dto);
    }

    @ApiOperation({ summary: 'Eliminar una película', description: 'Con este endpoint podemos ELIMINAR una entrada de la tabla "Peliculas" de la base de datos usando su ID. [ACCIÓN SOLO PARA ADMINISTRADORES]' })
    @Allow(["ADMINISTRADOR"])
    @Delete(":id")
    eliminarPelicula(@Param('id') id: string){
        return this.peliculasService.eliminarPelicula(id)
    }

    @ApiOperation({ summary: 'Sincronizar SWAPI', description: 'Con este endpoint podemos traer los datos de peliculas usando la API de Star Wars re piola. [UPSERT][ACCIÓN SOLO PARA ADMINISTRADORES]' })
    @Allow(["ADMINISTRADOR"])
    @Post('sync')
    sincronizarSwapi() {
      return this.peliculasService.syncSwapi();
    }
}