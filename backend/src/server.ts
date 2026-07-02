import './infra/zod-error-map'
import { api } from './api'
import { env } from './env'
import logger from './infra/logger'
import { dataSource } from './infra/orm/datasource'
import { NodemailerEmailService } from './infra/services/email/nodemailer-email-service'
import { startWorkers } from './infra/queue/workers'

export async function apiProvider(): Promise<void> {
  try {
    logger.info('⏳ Setting up and initialize api')

    api.listen(env.PORT)

    logger.info(`✅ Api listening on port ${env.PORT}`)
  } catch (error) {
    logger.error(error, 'Error during api initialization', 'MSG')
  }
}

export async function databaseProvider(): Promise<void> {
  try {
    logger.info('⏳ Setting up and initialize Postgres database ')

    await dataSource.initialize()

    logger.info('✅ Postgres initialized')
  } catch (error) {
    logger.error(
      error,
      '🛑 Error during Postgres database initialization. Description:\n',
      'MSG',
    )
  }
}

export async function queueProvider(): Promise<void> {
  if (!env.REDIS_URL) {
    logger.info('REDIS_URL not set — queue workers disabled')
    return
  }

  if (
    !env.SMTP_HOST ||
    !env.SMTP_USER ||
    !env.SMTP_PASS ||
    !env.SMTP_FROM
  ) {
    logger.info('SMTP config incomplete — queue workers disabled')
    return
  }

  const emailService = new NodemailerEmailService({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_FROM,
  })

  startWorkers(env.REDIS_URL, emailService)
  logger.info('✅ Queue workers started')
}

export async function server(): Promise<void> {
  try {
    logger.info('⏳ Setting up and initialize server')

    await databaseProvider()
    await queueProvider()
    apiProvider()
    logger.info('✅ Server already is up!')
  } catch (error) {
    logger.fatal(error, 'Failed to start server')
    process.exit(1)
  }
}

server().catch(error =>
  logger.error(error, '🛑 Error during server inicialization. Description:\n', 'MSG'),
)
