import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
  DEBUG: z.coerce.number().default(1),
  PORT: z.coerce.number().default(3000),
  POSTGRES_URL: z.string(),
  SLAVE_POSTGRES_URL: z.string().optional(),
  DATA_SOURCE_POOL_SIZE: z.coerce.number().default(20),
  JWT_SECRET: z.string(),
  REDIS_URL: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (parsedEnv.success === false) {
  console.error('Invalid environment variables', parsedEnv.error.format());

  throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;