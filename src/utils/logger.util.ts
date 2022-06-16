import { injectable } from "inversify";
import WinstonDaily from "winston-daily-rotate-file";
import winston from "winston";
import path from "path";

@injectable()
export class Logger {
  private logDir = path.join(__dirname + "../../../logs");

  private dailyOptions(level: string) {
    return {
      level,
      datePattern: "YYYY-MM-DD",
      dirname: `${this.logDir}/${level}`,
      filename: `%DATE%.${level}.log`,
      maxFiles: 30,
      zippedArchive: true,
    };
  }

  private formatter = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.splat(),
    winston.format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  );

  private logger: winston.Logger;

  constructor() {
    const transport = new winston.transports.Console({
      level: "silly",
      format: this.formatter,
    });

    const simpleTransport = new winston.transports.Console({
      level: "error",
      format: winston.format.simple(),
    });

    this.logger = winston.createLogger({
      transports: [
        process.env.NODE_ENV === "production" ? simpleTransport : transport,
        new WinstonDaily(this.dailyOptions("info")),
        new WinstonDaily(this.dailyOptions("warn")),
        new WinstonDaily(this.dailyOptions("error")),
      ],
    });
  }

  morganStream(message: string) {
    this.logger.info(message.substring(0, message.lastIndexOf("\n")));
  }

  /**
   * error: 0
   */
  error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }

  /**
   * warn: 1
   */
  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  /**
   * info: 2
   */
  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  /**
   * http: 3
   */
  http(message: string, meta?: any) {
    this.logger.http(message, meta);
  }

  /**
   * verbose: 4
   */
  verbose(message: string, meta?: any) {
    this.logger.verbose(message, meta);
  }

  /**
   * debug: 5
   */
  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  /**
   * silly: 6
   */
  silly(message: string, meta?: any) {
    this.logger.silly(message, meta);
  }
}
