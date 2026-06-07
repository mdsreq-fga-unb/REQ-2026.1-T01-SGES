import type { IQueueProducer, QueueJobData, QueueName } from '@/application/services/queue-producer'

export class NoopQueueProducer implements IQueueProducer {
  async add<Q extends QueueName>(_queue: Q, _data: QueueJobData[Q]): Promise<void> {}
}
