jest.mock('@nestjs/common', () => ({
  Injectable: () => undefined,
  UnauthorizedException: class UnauthorizedException extends Error {},
}));

jest.mock('@nestjs/config', () => ({
  ConfigService: class ConfigService {},
}));

jest.mock('@nestjs/jwt', () => ({
  JwtService: class JwtService {},
}));

import bcrypt from 'bcryptjs';
import { AuthService } from '../src/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;
  let config: any;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    jwt = {
      signAsync: jest.fn().mockResolvedValue('token-value'),
      verifyAsync: jest.fn(),
    };

    config = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
        if (key === 'JWT_ACCESS_EXPIRES_IN') return '15m';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return undefined;
      }),
    };

    service = new AuthService(prisma, jwt, config);
  });

  it('registers a user and returns JWT payload', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 'user-1', email: 'test@example.com', name: 'Tester' });
    prisma.user.update.mockResolvedValue({});

    const result = await service.register({
      name: 'Tester',
      email: 'test@example.com',
      password: 'secret123',
    });

    expect(result.user.email).toBe('test@example.com');
    expect(result.accessToken).toBe('token-value');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('rejects invalid login credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: await bcrypt.hash('secret123', 10),
      name: 'User',
    });

    await expect(
      service.login({ email: 'user@example.com', password: 'wrong-password' }),
    ).rejects.toThrow('Invalid credentials');
  });
});
