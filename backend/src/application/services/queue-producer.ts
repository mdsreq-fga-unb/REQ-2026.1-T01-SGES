export const QueueNames = {
  SEND_CREDENTIALS: 'send-credentials',
  SEND_RESET_CODE: 'send-reset-code',
} as const

export type QueueName = (typeof QueueNames)[keyof typeof QueueNames]

export type QueueJobData = {
  [QueueNames.SEND_CREDENTIALS]: { name: string; email: string; password: string }
  [QueueNames.SEND_RESET_CODE]: { email: string; code: string }
}

export interface IQueueProducer {
  add<Q extends QueueName>(queue: Q, data: QueueJobData[Q]): Promise<void>
}
