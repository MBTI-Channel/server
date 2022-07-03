import { DataSource } from "typeorm";
import config from "./config/index";
import { nodeEnv } from "./shared/constant.shared";

const { mysql } = config;

const appDataSource = new DataSource({
  type: "mysql",
  host: mysql.host,
  port: mysql.port,
  username: mysql.username,
  password: mysql.password,
  database: mysql.database,
  entities: [__dirname + "/modules/**/*.entity{.ts,.js}"],
  // migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
  // migrationsTableName: "food_app_migrations",
  logging: nodeEnv === "production" ? false : true,
  // synchronize: process.env.NODE_ENV === "production" ? false : true,
  // 또는 환경에 맞게 수정하여 사용
});

export default appDataSource;
