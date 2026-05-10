import { api } from "./api";
import { env } from "./env";
import logger from "./infra/logger";
import { dataSource } from "./infra/orm/datasource";

export async function apiProvider(): Promise<void> {
  try {
    logger.info('⏳ Setting up and initialize api');

    api.listen(env.PORT);

    logger.info(`✅ Api listening on port ${env.PORT}`);
  } catch (error) {
    logger.error(error, 'Error during api initialization', 'MSG');
  }
}

export async function databaseProvider(): Promise<void> {
  try {
    logger.info('⏳ Setting up and initialize Postgres database ');

    await dataSource.initialize();

    logger.info('✅ Postgres initialized');
  } catch (error) {
    logger.error(
      error,
      '🛑 Error during Postgres database initialization. Description:\n',
      'MSG',
    );
  }
}

export async function server(): Promise<void> {
  try {
    logger.info('⏳ Setting up and initialize server');

    await databaseProvider();
    const httpServer = apiProvider();
    logger.info('✅ Server already is up!');
  } catch (error) {
    logger.fatal(error, 'Failed to start server');
    process.exit(1);
  }
}

server().catch(error =>
  logger.error(error, '🛑 Error during server inicialization. Description:\n', 'MSG'),
);