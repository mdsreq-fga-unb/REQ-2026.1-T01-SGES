import { env } from '@/env'
import { DataSource } from 'typeorm'
import { UserEntity } from './entity/user-entity'
import { StudentEntity } from './entity/student-entity'
import { ClassEntity } from './entity/class-entity'
import { InstructorHistoryEntity } from './entity/instructor-history-entity'
import { NotificationEntity } from './entity/notification-entity'
import { FormEntity, FormResponseEntity } from './entity/form-entity'
import { AttendanceEntity } from './entity/attendance-entity'
import { EnrollmentEntity } from './entity/enrollment-entity'
import { SecurityLogEntity } from './entity/security-log-entity'
import { CreateUsersTable1780757930000 } from './migrations/1780757930000-CreateUsersTable'
import { AddResetCodeToUsers1780857930000 } from './migrations/1780857930000-AddResetCodeToUsers'
import { FixResetCodeExpiresAtTimezone1780957930000 } from './migrations/1780957930000-FixResetCodeExpiresAtTimezone'
import { CreateEnrollmentTables1782000000000 } from './migrations/1782000000000-CreateEnrollmentTables'
import { CreateSecurityLogsTable1782200000000 } from './migrations/1782200000000-CreateSecurityLogsTable'

type Config = {
  [K in typeof env.NODE_ENV]: () => DataSource
}

const defaultConfig = {
  migrationsRun: true,
  entities: [UserEntity, StudentEntity, ClassEntity, InstructorHistoryEntity, NotificationEntity, FormEntity, FormResponseEntity, AttendanceEntity, EnrollmentEntity, SecurityLogEntity],
  migrations: [
    CreateUsersTable1780757930000,
    AddResetCodeToUsers1780857930000,
    FixResetCodeExpiresAtTimezone1780957930000,
    CreateEnrollmentTables1782000000000,
    CreateSecurityLogsTable1782200000000,
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
  prod: () => {
    const baseConfig = {
      ...defaultConfig,
      type: 'postgres' as const,
      poolSize: env.DATA_SOURCE_POOL_SIZE,
      ssl: true,
      extra: { ssl: { rejectUnauthorized: false } },
    }

    if (env.SLAVE_POSTGRES_URL) {
      return new DataSource({
        ...baseConfig,
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
      })
    }

    return new DataSource({
      ...baseConfig,
      url: env.POSTGRES_URL,
    })
  },
}

export const dataSource = config[env.NODE_ENV]()
