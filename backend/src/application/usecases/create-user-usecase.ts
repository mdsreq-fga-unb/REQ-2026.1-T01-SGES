import bcrypt from 'bcryptjs'
import type { Validator } from '@/application/infra/services/shared/validator'
import { ConflictError } from '@/application/infra/errors'
import type { UserRole } from '@/domain'
import type { UserRepository } from '../services/user-repository'
import type { IQueueProducer } from '../services/queue-producer'
import { QueueNames } from '../services/queue-producer'

export class CreateUserUseCase {
  public static Name = 'CreateUserUseCase' as const

  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: Validator<CreateUserUseCase.Input>,
    private readonly queueProducer: IQueueProducer,
  ) {}

  async execute(input: CreateUserUseCase.Input): Promise<CreateUserUseCase.Output> {
    await this.validator.validate(input)

    const existing = await this.userRepository.findByEmail(input.email)
    if (existing) throw new ConflictError('Email already in use')

    const registerCode = input.registerCode ?? String(Date.now() % 1_000_000).padStart(6, '0')
    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user = await this.userRepository.save({ ...input, registerCode, password: hashedPassword })

    await this.queueProducer.add(QueueNames.SEND_CREDENTIALS, {
      name: user.name,
      email: user.email,
      password: input.password,
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      registerCode: user.registerCode,
      createdAt: user.createdAt,
    }
  }
}

export namespace CreateUserUseCase {
  export type Input = {
    name: string
    email: string
    password: string
    registerCode?: string
    role: UserRole
  }

  export type Output = {
    id: string
    name: string
    email: string
    role: UserRole
    registerCode: string
    createdAt: Date
  }
}
