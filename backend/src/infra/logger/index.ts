import { env } from '@/env';
import pino, { Logger as PinoLogger } from 'pino';

export type ErrorCategory = 'API' | 'HTTP' | 'BWE' | 'MSG';

interface LoggerChildrens {
  API: PinoLogger;
  HTTP: PinoLogger;
  BWE: PinoLogger;
  MSG: PinoLogger;
}

export class Logger {
  private logger: PinoLogger;

  private loggersChildrens;

  constructor() {
    this.logger = pino({
      name: 'sges',
      transport:
        env.NODE_ENV === 'prod' ? { target: 'pino-pretty' } : { target: 'pino-pretty' },
    });

    this.loggersChildrens = this.createChildrens();
  }

  public info(message: string | object): void {
    this.logger.info(message);
  }

  public infoHTTP(message: object): void {
    this.loggersChildrens.HTTP.info(message);
  }

  public error(error: any, message: string, category: ErrorCategory): void {
    this.selectLoggerError(error, message, category);
  }

  public fatal(error: any, message: string): void {
    this.logger.fatal(error, message);
  }

  public debug(message: string | object): void {
    if (env.DEBUG) {
      this.logger.debug(message);
    }
  }

  private createChildrens(): LoggerChildrens {
    return {
      API: this.logger.child({ category: 'API' }),
      HTTP: this.logger.child({ category: 'HTTP' }),
      BWE: this.logger.child({ category: 'BWE' }),
      MSG: this.logger.child({ category: 'MSG' }),
    };
  }

  private selectLoggerError(
    error: object,
    message: string,
    category: ErrorCategory,
  ) {
    this.loggersChildrens[category].error(error, message);
  }
}

const logger = new Logger();

export default logger;
