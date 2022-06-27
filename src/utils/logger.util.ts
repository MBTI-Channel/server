import { injectable } from "inversify";
import WinstonDaily from "winston-daily-rotate-file";
import winston from "winston";
import path from "path";

const nodeEnv = process.env.NODE_ENV;
const logDir = path.join(__dirname + "../../../logs");

@injectable()
export class Logger {
  private _dailyOptions(level: string) {
    return {
      level,
      datePattern: "YYYY-MM-DD",
      dirname: `${logDir}/${level}`,
      filename: `%DATE%.${level}.log`,
      maxFiles: 30,
      zippedArchive: true,
    };
  }

  private _formatter = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: nodeEnv === "production" ? false : true }),
    winston.format.splat(),
    winston.format.printf((info) => {
      if (info instanceof Error) {
        return `${info.timestamp} ${info.level}: ${info.message} ${info.stack}`;
      }
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  );

  private _logger: winston.Logger;

  constructor() {
    this._logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: nodeEnv === "production" ? "error" : "silly",
          format: this._formatter,
        }),
        new WinstonDaily(this._dailyOptions("info")),
        new WinstonDaily(this._dailyOptions("warn")),
        new WinstonDaily(this._dailyOptions("error")),
      ],
    });
  }

  morganStream(message: string) {
    this._logger.info(message.substring(0, message.lastIndexOf("\n")));
  }

  /**
   * error: 0
   */
  error(err: any, message?: string, meta?: any) {
    if (message)
      this._logger.error(`${err.name}: ${message} \n ${err.stack}`, meta);
    this._logger.error(`${err.name}: ${err.message} \n ${err.stack}`, meta);
  }

  /**
   * warn: 1
   */
  warn(message: string, meta?: any) {
    this._logger.warn(message, meta);
  }

  /**
   * info: 2
   */
  info(message: string, meta?: any) {
    this._logger.info(message, meta);
  }

  /**
   * http: 3
   */
  http(message: string, meta?: any) {
    this._logger.http(message, meta);
  }

  /**
   * verbose: 4
   */
  verbose(message: string, meta?: any) {
    this._logger.verbose(message, meta);
  }

  /**
   * debug: 5
   */
  debug(message: string, meta?: any) {
    this._logger.debug(message, meta);
  }

  /**
   * silly: 6
   */
  silly(message: string, meta?: any) {
    this._logger.silly(message, meta);
  }
}
