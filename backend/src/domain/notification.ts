import type { BaseDomain } from './base-domain'

export type Notification = BaseDomain & {
  userId: string
  title: string
  message: string
  isRead: boolean
}
