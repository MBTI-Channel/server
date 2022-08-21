import { FileTargetType } from "../../../shared/enum.shared";

export interface IFileService {
  create(
    targetType: FileTargetType,
    targetId: number,
    filesUrl: string[]
  ): Promise<void>;
  remove(targetType: FileTargetType, targetId: number): Promise<void>;
}
