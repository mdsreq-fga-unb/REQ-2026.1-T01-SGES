import bcrypt from 'bcryptjs'
import type { Validator } from '@/application/infra/services/shared/validator'
import { UnauthorizedError } from '@/application/infra/errors'
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
    await this.validator.validate(input)

    const user = await this.userRepository.findByEmail(input.email)

    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid credentials')
    }

    return {
      token: this.tokenService.generate({
        email: user.email,
        role: user.role,
        name: user.name,
        registerCode: user.registerCode,
      }),
    }
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
