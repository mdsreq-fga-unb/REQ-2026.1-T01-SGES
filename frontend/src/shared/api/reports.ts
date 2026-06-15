import { apiClient } from './client';

export interface FunnelReportDto {
  entered: number;
  active: number;
  evaded: number;
  completed: number;
}

export const reportsApi = {
  async getFunnel(semester?: string): Promise<FunnelReportDto> {
    const { data } = await apiClient.get<FunnelReportDto>('/reports/funnel', {
      params: { semester },
    });
    return data;
  },
};
