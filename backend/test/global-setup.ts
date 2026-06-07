import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { UserEntity } from '../src/infra/orm/entity/user-entity'
import { CreateUsersTable1780757930000 } from '../src/infra/orm/migrations/1780757930000-CreateUsersTable'
import { AddResetCodeToUsers1780857930000 } from '../src/infra/orm/migrations/1780857930000-AddResetCodeToUsers'
import { FixResetCodeExpiresAtTimezone1780957930000 } from '../src/infra/orm/migrations/1780957930000-FixResetCodeExpiresAtTimezone'

export async function setup(): Promise<void> {
  const url = process.env.POSTGRES_URL
  if (!url) return

  const ds = new DataSource({
    type: 'postgres',
    url,
    ssl: false,
    migrationsRun: true,
    entities: [UserEntity],
    migrations: [
      CreateUsersTable1780757930000,
      AddResetCodeToUsers1780857930000,
      FixResetCodeExpiresAtTimezone1780957930000,
    ],
  })

  await ds.initialize()
  await ds.destroy()
}
