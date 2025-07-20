import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from 'src/roles/guards/roles.guards';
import { RolesEnum } from 'src/roles/enums/roles.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if no roles are required', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn(),
      } as unknown as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should return true if user has required role', () => {
      const mockRequest = {
        user: {
          role: RolesEnum.ADMIN,
        },
      };

      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([RolesEnum.ADMIN]);

      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should throw ForbiddenException if user does not have required role', () => {
      const mockRequest = {
        user: {
          role: RolesEnum.USER,
        },
      };

      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([RolesEnum.ADMIN]);

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });
  });
});
