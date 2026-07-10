import {IsEmail, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'rodrigodepaul@gmail.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '123456789!@xyz123' })
    @IsNotEmpty()
    password!: string;
}
