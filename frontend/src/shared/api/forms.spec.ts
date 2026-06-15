import { describe, it, expect, vi } from 'vitest';
import { formsApi, type FormField } from './forms';
import { apiClient } from './client';

vi.mock('./client', () => {
  return {
    apiClient: {
      get: vi.fn(),
      post: vi.fn(),
    },
  };
});

describe('formsApi', () => {
  it('should fetch all forms successfully', async () => {
    const mockForms = [
      { id: 'f1', title: 'Survey A', description: 'Desc A', fields: [], createdAt: '2026-06-14' },
    ];
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockForms });

    const result = await formsApi.getAll();

    expect(apiClient.get).toHaveBeenCalledWith('/forms');
    expect(result).toEqual(mockForms);
  });

  it('should create a custom form successfully', async () => {
    const newFields: FormField[] = [
      { id: 'q1', type: 'text', label: 'What is your job?', required: true },
    ];
    const mockForm = { id: 'f2', title: 'Survey B', description: 'Desc B', fields: newFields, createdAt: '2026-06-14' };
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockForm });

    const result = await formsApi.create('Survey B', 'Desc B', newFields);

    expect(apiClient.post).toHaveBeenCalledWith('/forms', {
      title: 'Survey B',
      description: 'Desc B',
      fields: newFields,
    });
    expect(result).toEqual(mockForm);
  });

  it('should submit a form response successfully', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

    await formsApi.submitResponse('f1', 'student-1', { q1: 'Developer' });

    expect(apiClient.post).toHaveBeenCalledWith('/forms/f1/responses', {
      studentId: 'student-1',
      answers: { q1: 'Developer' },
    });
  });
});
