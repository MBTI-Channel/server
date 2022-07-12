import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import config from "./config/index";

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
  logging: process.env.NODE_ENV === "production" ? false : true,
  namingStrategy: new SnakeNamingStrategy(),
  //synchronize: true,
});

export default appDataSource;
