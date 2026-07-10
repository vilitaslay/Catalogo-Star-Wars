import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: any;

  const mockContext = (userRol?: string) =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: { rol: userRol } }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(async () => {
    reflector = { getAllAndOverride: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, { provide: Reflector, useValue: reflector }],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
  });

  it('debería corroborar contexto de los roles', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(mockContext('REGULAR'))).toBe(true);
  });

  it('debería dejar pasar solo a los admins', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMINISTRADOR']);

    expect(guard.canActivate(mockContext('ADMINISTRADOR'))).toBe(true);
  });

  it('debería denegar el acceso cuando el rol no está especificado', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMINISTRADOR']);

    expect(guard.canActivate(mockContext('REGULAR'))).toBe(false);
  });
});