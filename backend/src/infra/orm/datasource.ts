import { env } from "@/env";
import { DataSource } from "typeorm";

type Config = {
  [K in typeof env.NODE_ENV]: () => DataSource;
};

const defaultConfig = {
  migrationsRun: true,
  entities: [],
  migrations: [],
};

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
};

export const dataSource = config[env.NODE_ENV]();
