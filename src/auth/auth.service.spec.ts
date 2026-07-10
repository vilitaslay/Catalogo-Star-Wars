import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;

  beforeEach(async () => {
    // fake PrismaService — just enough methods for AuthService to call
    prisma = {
      usuario: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    // fake JwtService
    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('debería hashear la contraseña y NO exponerla', async () => {
  const dto = { email: 'test@test.com', password: 'password123' };

  prisma.usuario.findUnique.mockResolvedValue(null); // no existing user
  prisma.usuario.create.mockResolvedValue({
    id: 'fake-id',
    email: dto.email,
    password: 'hash',
    rol: 'REGULAR',
  });

  const result = await service.registrarse(dto);

  expect(result).not.toHaveProperty('password');
  expect(result.email).toBe(dto.email);
  expect(prisma.usuario.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        email: dto.email,
      }),
    }),
  );
}); 
});