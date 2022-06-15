import "reflect-metadata";
import { server } from "./server";
import config from "./config";

server
  .build()
  .listen(config.port, () => console.log(`✅ server on ${config.port}`));
