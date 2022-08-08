import { Trend } from "../entity/trend.entity";

export interface ITrendRepository {
  createTrend(trendEntity: Trend): Promise<Trend>;
}
