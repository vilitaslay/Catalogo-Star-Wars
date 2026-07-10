import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';


// funcioncitas de authh
@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ){}


    private async find(email: string) {
        return this.prisma.usuario.findUnique({where: {email: email}});
    }

    private async hashPassword(password: string){
        const salt = await bcrypt.genSalt(10);
        const contra_hasheada = await bcrypt.hash(password, salt);
        return contra_hasheada
    }

    async registrarse(dto: RegisterDto){
        // a ver si el usuario ya existe
        const email = dto.email;
        const contra = dto.password;
        
        const existe = await this.find(email);
        if(existe){
            throw new ConflictException('Ya existe un usuario con ese mail! elegí otro >:(');
        }

        const contra_hasheada = await this.hashPassword(contra);

        const usuario = await this.prisma.usuario.create({
            data: { email, password: contra_hasheada },
        });

        const { password, ...resultado } = usuario;
        return resultado;
    }

    async loggearse(dto: LoginDto) {
        const email = dto.email;
        const password = dto.password;

        // who's this mf
        const usuario = await this.find(email)
        if(!usuario){
            throw new UnauthorizedException('mmmm me pa que no existis, pero podes registrarte!');
        }

        // is this you!?
        const check = await bcrypt.compare(password, usuario.password);
        if(!check){
            throw new UnauthorizedException("SIKE, THAT'S THE WRONG PASSWORD")
        }
        const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
        const token = this.jwtService.sign(payload);
        return { access_token: token };
    }
    
}


// GUARDS! ARREST HIM!
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
