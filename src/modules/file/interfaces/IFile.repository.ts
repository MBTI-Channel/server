import { FileTargetType } from "../../../shared/enum.shared";
import { File } from "../entity/file.entity";

export interface IFileRepository {
  create(fileEntity: File[]): Promise<void>;
  findFilesId(
    targetType: FileTargetType,
    targetId: number
  ): Promise<number[] | null>;
  remove(filesId: number[]): Promise<void>;
}
