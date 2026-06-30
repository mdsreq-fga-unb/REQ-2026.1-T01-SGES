import type { Validator } from '@/application/infra/services/shared/validator'
import { NotFoundError, ConflictError } from '@/application/infra/errors'
import logger from '@/infra/logger'
import { type UserRole } from '@/domain'
import type { UserRepository } from '../services/user-repository'
import type { SecurityLogRepository } from '../services/security-log-repository'

export class UpdateUserUseCase {
  public static Name = 'UpdateUserUseCase' as const

  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: Validator<UpdateUserUseCase.Input>,
    private readonly securityLogRepository: SecurityLogRepository,
  ) {}

  async execute(input: UpdateUserUseCase.Input): Promise<UpdateUserUseCase.Output> {
    const validatedInput = await this.validator.validate(input)

    logger.debug({ userId: validatedInput.id }, 'UpdateUser: iniciando atualização')

    const existingUser = await this.userRepository.findById(validatedInput.id)
    if (!existingUser) {
      logger.info({ userId: validatedInput.id }, 'UpdateUser: usuário não encontrado')
      throw new NotFoundError('User not found')
    }

    if (validatedInput.email.toLowerCase() !== existingUser.email.toLowerCase()) {
      const emailConflict = await this.userRepository.findByEmail(validatedInput.email)
      if (emailConflict) {
        logger.info({ email: validatedInput.email }, 'UpdateUser: email já cadastrado para outro usuário')
        throw new ConflictError('Email already in use')
      }
    }

    const updatedUser = await this.userRepository.save({
      ...existingUser,
      name: validatedInput.name,
      email: validatedInput.email,
      role: validatedInput.role,
    })

    await this.securityLogRepository.save({
      userId: updatedUser.id,
      action: 'UPDATE_USER',
      details: `Updated user profile. Changes: Name: ${existingUser.name} -> ${validatedInput.name}, Email: ${existingUser.email} -> ${validatedInput.email}, Role: ${existingUser.role} -> ${validatedInput.role}`,
    })

    logger.info({ userId: updatedUser.id, email: updatedUser.email }, 'UpdateUser: usuário atualizado com sucesso')

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      registerCode: updatedUser.registerCode,
    }
  }
}

export namespace UpdateUserUseCase {
  export type Input = {
    id: string
    name: string
    email: string
    role: UserRole
  }

  export type Output = {
    id: string
    name: string
    email: string
    role: UserRole
    registerCode: string
  }
}
