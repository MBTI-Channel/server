import { UpdateLogType } from "../../../../shared/type.shared";
import { User } from "../../entity/user.entity";
import { UpdateLog } from "../entity/update-log.entity";

export interface IUpdateLogService {
  create(
    user: User,
    type: UpdateLogType,
    before: string,
    after: string
  ): Promise<UpdateLog>;
  findLastOneByType(id: number, type: UpdateLogType): Promise<UpdateLog | null>;
}
