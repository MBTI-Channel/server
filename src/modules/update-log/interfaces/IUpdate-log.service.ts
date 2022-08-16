import { UpdateLogType } from "../../../shared/type.shared";
import { UpdateLog } from "../entity/update-log.entity";

export interface IUpdateLogService {
  findLastOneByType(id: number, type: UpdateLogType): Promise<UpdateLog | null>;
}
