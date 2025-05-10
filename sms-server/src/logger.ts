const logLevels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
} as const;

type LogLevel = typeof logLevels[keyof typeof logLevels];

class Logger {
  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? `\nData: ${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] ${level}: ${message}${dataStr}`;
  }

  info(message: string, data?: any): void {
    console.log(this.formatMessage(logLevels.INFO, message, data));
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatMessage(logLevels.WARN, message, data));
  }

  error(message: string, data?: any): void {
    console.error(this.formatMessage(logLevels.ERROR, message, data));
  }

  debug(message: string, data?: any): void {
    console.debug(this.formatMessage(logLevels.DEBUG, message, data));
  }
}

export const logger = new Logger(); 