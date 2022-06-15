import { DataSource } from "typeorm";
import config from "./config/index";

const { mysql } = config;

const appDataSource = new DataSource({
  type: "mysql",
  host: mysql.host,
  port: mysql.port,
  username: mysql.username,
  password: mysql.password,
  database: mysql.database,
  entities: [__dirname + "**/*.entity{.ts,.js}"],
  // migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
  // migrationsTableName: "food_app_migrations",
});

export default appDataSource;
