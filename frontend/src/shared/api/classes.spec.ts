import { describe, it, expect, vi } from 'vitest';
import { classesApi } from './classes';
import { apiClient } from './client';

vi.mock('./client', () => {
  return {
    apiClient: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe('Classes API Client', () => {
  it('should fetch all classes', async () => {
    const mockClasses = [
      {
        id: 'c1',
        nomeCurso: 'Alfabetização - Turma A',
        livrosEstudados: 'Apostila 1',
        horario: '19:00 - 21:00',
        diaSemana: 'Sábado',
        vagasLimite: 50,
        semester: '2026.1',
      },
    ];
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockClasses });

    const result = await classesApi.getAll();

    expect(apiClient.get).toHaveBeenCalledWith('/classes');
    expect(result).toEqual(mockClasses);
  });

  it('should fetch students in a class', async () => {
    const mockStudents = [
      { id: 's1', name: 'João Silva', email: 'joao@email.com', codigo_matricula: 'MAT-000001' },
    ];
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockStudents });

    const result = await classesApi.getStudents('c1');

    expect(apiClient.get).toHaveBeenCalledWith('/classes/c1/students');
    expect(result).toEqual(mockStudents);
  });

  it('should create a new class', async () => {
    const input = {
      nomeCurso: 'Costura Avançada',
      livrosEstudados: 'Manual do Costureiro Pro',
      horario: '10:00 - 12:00',
      diaSemana: 'Sábado',
      vagasLimite: 20,
      instructorIds: [],
    };
    const mockClass = { id: 'c3', ...input, semester: '2026.1' };
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockClass });

    const result = await classesApi.create(input);

    expect(apiClient.post).toHaveBeenCalledWith('/classes', input);
    expect(result).toEqual(mockClass);
  });

  it('should update an existing class', async () => {
    const input = {
      nomeCurso: 'Costura Avançada - Modificado',
      livrosEstudados: 'Manual do Costureiro Pro',
      horario: '14:00 - 16:00',
      diaSemana: 'Sábado',
      vagasLimite: 25,
      instructorIds: ['u1'],
    };
    const mockClass = { id: 'c3', ...input, semester: '2026.1' };
    vi.mocked(apiClient.put).mockResolvedValue({ data: mockClass });

    const result = await classesApi.update('c3', input);

    expect(apiClient.put).toHaveBeenCalledWith('/classes/c3', input);
    expect(result).toEqual(mockClass);
  });
});
