import bcrypt from 'bcryptjs'
import type { Validator } from '@/application/infra/services/shared/validator'
import { ConflictError } from '@/application/infra/errors'
import logger from '@/infra/logger'
import { generateDefaultPassord, generateRegisterCode, type UserRole } from '@/domain'
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
    const validatedInput = await this.validator.validate(input)

    logger.debug({ email: validatedInput.email, role: validatedInput.role }, 'CreateUser: iniciando criação')

    const existing = await this.userRepository.findByEmail(validatedInput.email)
    if (existing) {
      logger.info({ email: validatedInput.email }, 'CreateUser: email já cadastrado')
      throw new ConflictError('Email already in use')
    }

    const registerCode = generateRegisterCode();

    const password = generateDefaultPassord();
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.userRepository.save({
      ...validatedInput,
      registerCode,
      password: hashedPassword,
    })

    logger.info({ userId: user.id, email: user.email, role: user.role }, 'CreateUser: usuário criado')

    await this.queueProducer.add(QueueNames.SEND_CREDENTIALS, {
      name: user.name,
      email: user.email,
      password,
    })

    logger.debug({ email: user.email, queue: QueueNames.SEND_CREDENTIALS }, 'CreateUser: job de credenciais enfileirado')

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
