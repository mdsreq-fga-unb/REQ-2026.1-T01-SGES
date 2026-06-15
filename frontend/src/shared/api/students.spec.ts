import { describe, it, expect, vi } from 'vitest';
import { studentsApi } from './students';
import { apiClient } from './client';

vi.mock('./client', () => {
  return {
    apiClient: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
    },
  };
});

describe('studentsApi', () => {
  it('should fetch all students successfully', async () => {
    const mockStudents = [
      { id: 's1', name: 'John Doe', email: 'john@test.com', codigo_matricula: '111', profissao: 'Eng', fotoUrl: null },
    ];
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockStudents });

    const result = await studentsApi.getAll();

    expect(apiClient.get).toHaveBeenCalledWith('/students');
    expect(result).toEqual(mockStudents);
  });

  it('should register a new student successfully', async () => {
    const newStudent = { name: 'John Doe', email: 'john@test.com', codigo_matricula: '111', profissao: 'Eng', fotoUrl: 'http://photo.com' };
    vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 's2', ...newStudent } });

    const result = await studentsApi.create(newStudent);

    expect(apiClient.post).toHaveBeenCalledWith('/students', newStudent);
    expect(result.id).toBe('s2');
  });

  it('should update an existing student successfully', async () => {
    const updateData = { name: 'John Doe Edit', email: 'john@test.com', codigo_matricula: '111', profissao: 'Designer', fotoUrl: null };
    vi.mocked(apiClient.put).mockResolvedValue({ data: { id: 's1', ...updateData } });

    const result = await studentsApi.update('s1', updateData);

    expect(apiClient.put).toHaveBeenCalledWith('/students/s1', updateData);
    expect(result.name).toBe('John Doe Edit');
  });
});
