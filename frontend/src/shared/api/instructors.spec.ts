import { describe, it, expect, vi } from 'vitest';
import { usersApi } from './classes';
import { apiClient } from './client';

vi.mock('./client', () => {
  return {
    apiClient: {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe('Instructors/Users API Client', () => {
  it('should fetch all users/instructors', async () => {
    const mockUsers = {
      users: [
        { id: 'u1', name: 'Nayla Nobre', email: 'admin@sges.com', role: 'admin' },
        { id: 'u2', name: 'Maria Instrutora', email: 'volunteer@sges.com', role: 'volunteer' },
      ],
    };
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockUsers });

    const result = await usersApi.getAll();

    expect(apiClient.get).toHaveBeenCalledWith('/users');
    expect(result).toEqual(mockUsers);
  });

  it('should create a new instructor/user', async () => {
    const input = {
      name: 'Pedro Voluntário',
      email: 'pedro@sges.com',
      role: 'volunteer' as const,
    };
    const mockUser = { id: 'u3', ...input };
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockUser });

    const result = await usersApi.create(input);

    expect(apiClient.post).toHaveBeenCalledWith('/users', input);
    expect(result).toEqual(mockUser);
  });

  it('should delete an instructor/user', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { success: true } });

    await usersApi.delete('u2');

    expect(apiClient.delete).toHaveBeenCalledWith('/users/u2');
  });
});
