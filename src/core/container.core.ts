import { Container } from "inversify";
import { IDatabaseService } from "./interfaces/IDatabase.service";
import { DatabaseService } from "./services/database.service";
import { Logger } from "../utils/logger.util";
import { TYPES } from "./type.core";

import "../controllers/index.controller";

const container = new Container();

container.bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);
container.bind(TYPES.Logger).to(Logger);

export default container;
