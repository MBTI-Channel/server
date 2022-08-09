import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, queryParam } from "inversify-express-utils";
import { TYPES } from "../../core/types.core";
import { queryValidator } from "../../middlewares/validator.middleware";
import { GetAllTrendDto } from "./dto/get-all-trend.dto";
import { ITrendService } from "./interfaces/ITrend.service";

@controller("/trends")
export class TrendController {
  constructor(
    @inject(TYPES.ITrendService)
    private readonly _trendService: ITrendService
  ) {}

  @httpGet("/", queryValidator(GetAllTrendDto))
  public async getTrends(
    @queryParam() query: GetAllTrendDto,
    req: Request,
    res: Response
  ) {
    const data = await this._trendService.getTrends(query);
    return res.status(200).json(data);
  }
}
