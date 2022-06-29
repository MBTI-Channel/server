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

  private _customLevels = {
    levels: {
      trace: 4,
      debug: 3,
      info: 2,
      warn: 1,
      error: 0,
    },
    colors: {
      trace: "cyan",
      debug: "green",
      info: "green",
      warn: "yellow",
      error: "red",
    },
  };

  private _formatter = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
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
      level: nodeEnv === "production" ? "warn" : "trace",
      levels: this._customLevels.levels,
      transports: [
        new winston.transports.Console({
          format: this._formatter,
        }),
        new WinstonDaily(this._dailyOptions("info")),
        new WinstonDaily(this._dailyOptions("warn")),
        new WinstonDaily(this._dailyOptions("error")),
      ],
    });
    winston.addColors(this._customLevels.colors);
  }

  morganStream(message: string) {
    this._logger.info(message.substring(0, message.lastIndexOf("\n")));
  }

  /**
   * @error 요청을 처리하는 중 문제가 발생한 경우
   * @level 0
   */
  error(err: any, message?: string, meta?: any) {
    if (message)
      this._logger.error(`${err.name}: ${message} \n ${err.stack}`, meta);
    this._logger.error(`${err.name}: ${err.message} \n ${err.stack}`, meta);
  }

  /**
   * @warn 처리 가능한 문제, 향후 시스템 에러의 원인이 될 수 있는 경고성 메시지를 나타냄
   * @level 1
   */
  warn(message: string, meta?: any) {
    this._logger.warn(message, meta);
  }

  /**
   * @info 상태변경과 같은 정보성 메시지를 나타냄
   * @level 2
   */
  info(message: string, meta?: any) {
    this._logger.info(message, meta);
  }

  /**
   * @debug 프로그램을 디버깅하기 위한 정보 지정
   * @level 3
   */
  debug(message: string, meta?: any) {
    this._logger.debug(message, meta);
  }

  /**
   * @trace debug보다 좀더 상세한 정보를 나타냄
   * @level 4
   */
  trace(message: string, meta?: any) {
    this._logger.log("trace", message, meta);
  }
}
