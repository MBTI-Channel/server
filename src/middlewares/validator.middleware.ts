import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";

/**
 * ValidationError 객체에서 에러 문자열을 추출해 반환
 */
const getErrorMessageArray = (errors: ValidationError[]) => {
  const errorsMessageArray: string[] = [];
  errors.forEach((errors) => {
    errorsMessageArray.push(...(Object as any).values(errors.constraints));
  });
  return errorsMessageArray;
};

interface IValidateOptions {
  propertyGetter: (req: Request) => any;
  propertySetter: (req: Request, dto: any) => void;
  dtoClass: any;
  skipMissingProperties?: boolean;
}

/**
 * `propertyGetter`로 지정된 프로퍼티를 유효성 검사한다.
 * @propertyGetter `(req) => req.property`
 * @propertySetter `(req, dto) => (req.property = dto)`
 * @dtoClass
 * @skipMissingProperties 기본 false. true라면 누락된 키값은 유효성 검사를 하지 않는다
 */
const validate = ({
  propertyGetter,
  propertySetter,
  dtoClass,
  skipMissingProperties = false,
}: IValidateOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const fields = propertyGetter(req) ?? {}; // req.property가 없다면 빈 객체 할당
    const dto = plainToInstance(dtoClass, fields); // 리터럴 -> dto 클래스로 변환

    validateOrReject(dto, { skipMissingProperties, whitelist: true })
      .then(() => {
        // 지정된 req.property에 dto 할당후 next 호출
        propertySetter(req, dto);
        next();
      })
      .catch((errors: ValidationError[]) => {
        const errorMessageArray = getErrorMessageArray(errors);
        return res.status(400).json({
          name: "ValidationErrorException",
          message: errorMessageArray,
        });
      });
  };
};

/**
 * body 유효성 검사기
 * @param dtoClass
 * @param skipMissingProperties 옵션. 기본 false
 * @returns `req.body` 리터럴 객체 -> dto class 객체
 */
export const bodyValidator = (
  dtoClass: any,
  skipMissingProperties?: boolean
) => {
  return validate({
    propertyGetter: (req) => req.body,
    propertySetter: (req, dto) => (req.body = dto),
    dtoClass,
    skipMissingProperties,
  });
};

/**
 * query 유효성 검사기
 * @param dtoClass
 * @param skipMissingProperties 옵션. 기본 false
 * @returns `req.query` 리터럴 객체 -> dto class 객체
 */
export const queryValidator = (
  dtoClass: any,
  skipMissingProperties?: boolean
) => {
  return validate({
    propertyGetter: (req) => req.query,
    propertySetter: (req, dto) => (req.query = dto),
    dtoClass,
    skipMissingProperties,
  });
};

/**
 * params 유효성 검사기
 * @param dtoClass
 * @param skipMissingProperties 옵션. 기본 false
 * @returns `req.params` 리터럴 객체 -> dto class 객체
 */
export const paramsValidator = (
  dtoClass: any,
  skipMissingProperties?: boolean
) => {
  return validate({
    propertyGetter: (req) => req.params,
    propertySetter: (req, dto) => (req.params = dto),
    dtoClass,
    skipMissingProperties,
  });
};
