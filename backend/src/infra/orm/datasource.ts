import { env } from '@/env'
import { DataSource } from 'typeorm'
import { UserEntity } from './entity/user-entity'
import { CreateUsersTable1780757930000 } from './migrations/1780757930000-CreateUsersTable'
import { AddResetCodeToUsers1780857930000 } from './migrations/1780857930000-AddResetCodeToUsers'
import { FixResetCodeExpiresAtTimezone1780957930000 } from './migrations/1780957930000-FixResetCodeExpiresAtTimezone'

type Config = {
  [K in typeof env.NODE_ENV]: () => DataSource
}

const defaultConfig = {
  migrationsRun: true,
  entities: [UserEntity],
  migrations: [
    CreateUsersTable1780757930000,
    AddResetCodeToUsers1780857930000,
    FixResetCodeExpiresAtTimezone1780957930000,
  ],
}

const config: Config = {
  dev: () =>
    new DataSource({
      ...defaultConfig,
      type: 'postgres',
      url: env.POSTGRES_URL,
    //   ssl: true,
    //   extra: { ssl: { rejectUnauthorized: false } },
    }),
  test: () =>
    new DataSource({
      ...defaultConfig,
      type: 'postgres',
      url: env.POSTGRES_URL,
      ssl: false,
    }),
  prod: () =>
    new DataSource({
      ...defaultConfig,
      type: 'postgres',
      poolSize: env.DATA_SOURCE_POOL_SIZE,
      ssl: true,
      extra: { ssl: { rejectUnauthorized: false } },
      replication: {
        master: {
          url: env.POSTGRES_URL,
        },
        slaves: [
          {
            url: env.SLAVE_POSTGRES_URL,
          },
        ],
      },
    }),
}

export const dataSource = config[env.NODE_ENV]()
