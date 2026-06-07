import type { Validator } from '@/application/infra/services/shared/validator'
import logger from '@/infra/logger'
import type { UserRole } from '@/domain'
import type { UserRepository } from '../services/user-repository'

const LIMIT = 10

export class ListUsersUseCase {
  public static Name = 'ListUsersUseCase' as const

  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: Validator<ListUsersUseCase.Input>,
  ) {}

  async execute(input: ListUsersUseCase.Input): Promise<ListUsersUseCase.Output> {
    const validatedInput = await this.validator.validate(input)

    const page = validatedInput.page ?? 1
    logger.debug({ page, limit: LIMIT }, 'ListUsers: buscando usuários')

    const { users, total } = await this.userRepository.findAll(page, LIMIT)
    const totalPages = Math.ceil(total / LIMIT)

    logger.info({ page, total, totalPages }, 'ListUsers: listagem concluída')

    return {
      data: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        registerCode: u.registerCode,
        createdAt: u.createdAt,
      })),
      page,
      limit: LIMIT,
      total,
      totalPages,
    }
  }
}

export namespace ListUsersUseCase {
  export type Input = {
    page?: number
  }

  export type UserItem = {
    id: string
    name: string
    email: string
    role: UserRole
    registerCode: string
    createdAt: Date
  }

  export type Output = {
    data: UserItem[]
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
