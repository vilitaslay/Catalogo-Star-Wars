import { IsOptional, IsInt, IsDateString, IsString} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CrearPeliculaDto {

    @ApiProperty({ example: 'The Last Jedi' }) // el mejor episodio btw
    @IsString()
    titulo!: string;

    @ApiPropertyOptional({ example: '2001-09-11T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    fecha_estreno!:  string;

    @ApiPropertyOptional({example: 4})
    @IsOptional()
    @IsInt()
    episodio!: number;


    @ApiPropertyOptional({ example: 'Jar Jar Binks' })
    @IsOptional()
    @IsString()
    director?: string;


    @IsOptional()
    @IsString()
    crawl_apertura?: string;


    @ApiProperty({ example: 'el contraataque del ultimo sith al despertar la fueza Skywalker' })
    @IsString()
    descripcion!:    string;
}