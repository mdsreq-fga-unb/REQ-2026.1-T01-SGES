import bcrypt from 'bcryptjs'
import type { Validator } from '@/application/infra/services/shared/validator'
import { UnauthorizedError, AppError } from '@/application/infra/errors'
import logger from '@/infra/logger'
import type { TokenService } from '../services/token-service'
import type { UserRepository } from '../services/user-repository'

export class AuthUseCase {
  public static Name = 'AuthUseCase' as const

  // In-memory failed attempts tracking
  private static failedAttempts = new Map<string, { count: number; blockedUntil: Date | null }>()

  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly validator: Validator<AuthUseCase.Input>,
  ) {}

  async execute(input: AuthUseCase.Input): Promise<AuthUseCase.Output> {
    const validatedInput = await this.validator.validate(input)
    const email = validatedInput.email.toLowerCase().trim()

    logger.debug({ email }, 'AuthUseCase: autenticando usuário')

    // Check if account is locked
    const lockInfo = AuthUseCase.failedAttempts.get(email)
    if (lockInfo && lockInfo.blockedUntil && lockInfo.blockedUntil.getTime() > Date.now()) {
      const remainingMinutes = Math.ceil((lockInfo.blockedUntil.getTime() - Date.now()) / (1000 * 60))
      logger.info({ email }, 'AuthUseCase: login bloqueado por excesso de tentativas')
      throw new AppError(423, `Conta bloqueada por excesso de tentativas. Tente novamente em ${remainingMinutes} minutos.`)
    }

    const user = await this.userRepository.findByEmail(validatedInput.email)

    if (!user) {
      logger.info({ email }, 'AuthUseCase: usuário não encontrado')
      throw new UnauthorizedError('Credenciais inválidas.')
    }

    const passwordMatch = await bcrypt.compare(validatedInput.password, user.password)

    if (!passwordMatch) {
      logger.info({ email }, 'AuthUseCase: senha incorreta')

      const currentAttempts = (lockInfo ? lockInfo.count : 0) + 1
      if (currentAttempts >= 5) {
        const blockedUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes lockout
        AuthUseCase.failedAttempts.set(email, { count: currentAttempts, blockedUntil })
        logger.info({ email, blockedUntil }, 'AuthUseCase: conta bloqueada por excesso de tentativas')
        throw new AppError(423, 'Conta bloqueada por excesso de tentativas. Tente novamente em 15 minutos.')
      } else {
        AuthUseCase.failedAttempts.set(email, { count: currentAttempts, blockedUntil: null })
        throw new UnauthorizedError('Credenciais inválidas.')
      }
    }

    // Success: Clear failed attempts
    AuthUseCase.failedAttempts.delete(email)

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
