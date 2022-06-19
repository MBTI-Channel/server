import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";

/**
 * @param type 리터럴 객체를 변환할 타입. 클래스 객체(DTO)
 * @param skipMissingProperties 기본값 false. true: 누락된 값은 유효성 검사를 하지않음
 * @returns body 리터럴 객체 -> body 클래스 객체
 */
export const DtoValidatorMiddleware = (
  type: any,
  skipMissingProperties = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);

    validateOrReject(dto, { skipMissingProperties })
      .then(() => {
        req.body = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        const errorsMessageArray: string[] = [];
        errors.forEach((errors) => {
          errorsMessageArray.push(
            ...(Object as any).values(errors.constraints)
          );
        });
        return res.status(400).json({
          name: "ValidationErrorException",
          message: errorsMessageArray,
        });
      });
  };
};
