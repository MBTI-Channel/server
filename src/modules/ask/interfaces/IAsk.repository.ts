import { Ask } from "../entity/ask.entity";

export interface IAskRepository {
  create(askEntity: Ask): Promise<Ask>;
}
