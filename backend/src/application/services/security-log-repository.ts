export interface SecurityLogRepository {
  save(data: { userId?: string | null; action: string; details?: string | null }): Promise<void>
}
