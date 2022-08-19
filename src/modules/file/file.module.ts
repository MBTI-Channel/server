import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { FileRepository } from "./file.repository";
import { FileService } from "./file.service";
import { IFileRepository } from "./interfaces/IFile.repository";
import { IFileService } from "./interfaces/IFile.service";

export const fileModule = new ContainerModule((bind) => {
  bind<IFileService>(TYPES.IFileService).to(FileService);
  bind<IFileRepository>(TYPES.IFileRepository).to(FileRepository);
});
