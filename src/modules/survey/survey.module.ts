import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { ISurveyRepository } from "./interfaces/ISurvey.repository";
import { ISurveyService } from "./interfaces/ISurvey.service";
import { SurveyRepository } from "./survey.repository";
import { SurveyService } from "./survey.service";

export const surveyModule = new ContainerModule((bind) => {
  bind<ISurveyService>(TYPES.ISurveyService).to(SurveyService);
  bind<ISurveyRepository>(TYPES.ISurveyRepository).to(SurveyRepository);
});
