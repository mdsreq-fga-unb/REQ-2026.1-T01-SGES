import type { BaseDomain } from './base-domain'

export type FormQuestion = {
  id: string
  label: string
  type: 'text' | 'rating' | 'select'
  options?: string[]
}

export type Form = BaseDomain & {
  title: string
  description?: string | null
  questions: FormQuestion[]
}

export type FormAnswer = {
  questionId: string
  answer: string | number
}

export type FormResponse = BaseDomain & {
  formId: string
  studentId: string
  answers: FormAnswer[]
}
