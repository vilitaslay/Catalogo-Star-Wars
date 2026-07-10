import { Controller, Body, Post , Get} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';


@ApiTags("Auth 🔐")
@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @ApiOperation({ summary: 'Registrarse!', description: 'Con este endpoint podemos registrar nuevos usuarios en la base de datos con un email y una contraseña. Se realiza prueba de existencia.' })
    @Post("registrarse")
    async registrarse(@Body() dto: RegisterDto) {
        return this.auth.registrarse(dto)
    }

    @ApiOperation({ summary: 'Iniciar Sesión', description: 'Con este endpoint podemos iniciar sesión (i.e. proveyendo email y contraseña se valida su existencia en la BBDD. De ser validado se obtendrá un token de sesión que utilizará para usar los endpoints que requieren autenticación)' })
    @Post("login")
    async login(@Body() dto: LoginDto){
        return this.auth.loggearse(dto)
    }
}
