import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'luminaraunduli@coruscant.gal' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'Bush!did!nine!eleven2001911' })
    @IsNotEmpty()
    password!: string;
}   