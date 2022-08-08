import { Trend } from "../entity/trend.entity";

export interface ITrendService {
  createTrend(targetId: number): Promise<void>;
}
