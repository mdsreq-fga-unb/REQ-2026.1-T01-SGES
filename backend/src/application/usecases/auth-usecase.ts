import bcrypt from 'bcryptjs'
import type { Validator } from '@/application/infra/services/shared/validator'
import { UnauthorizedError } from '@/application/infra/errors'
import logger from '@/infra/logger'
import type { TokenService } from '../services/token-service'
import type { UserRepository } from '../services/user-repository'

export class AuthUseCase {
  public static Name = 'AuthUseCase' as const

  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly validator: Validator<AuthUseCase.Input>,
  ) {}

  async execute(input: AuthUseCase.Input): Promise<AuthUseCase.Output> {
    const validatedInput = await this.validator.validate(input)

    logger.debug({ email: validatedInput.email }, 'AuthUseCase: autenticando usuário')

    const user = await this.userRepository.findByEmail(validatedInput.email)

    if (!user) {
      logger.info({ email: validatedInput.email }, 'AuthUseCase: usuário não encontrado')
      throw new UnauthorizedError('Invalid credentials')
    }

    const passwordMatch = await bcrypt.compare(validatedInput.password, user.password)

    if (!passwordMatch) {
      logger.info({ email: validatedInput.email }, 'AuthUseCase: senha incorreta')
      throw new UnauthorizedError('Invalid credentials')
    }

    const token = this.tokenService.generate({
      email: user.email,
      role: user.role,
      name: user.name,
      registerCode: user.registerCode,
    })

    logger.info({ email: user.email, role: user.role }, 'AuthUseCase: autenticado com sucesso')

    return { token }
  }
}

export namespace AuthUseCase {
  export type Input = {
    email: string
    password: string
  }

  export type Output = {
    token: string
  }
}
