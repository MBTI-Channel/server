import { ContainerModule } from "inversify";
import { TYPES } from "../../core/type.core";
import { BookmarkRepository } from "./bookmark.repository";
import { BookmarkService } from "./bookmark.service";
import { IBookmarkRepository } from "./interfaces/IBookmark.repository";
import { IBookmarkService } from "./interfaces/IBookmark.service";

export const bookmarkMoudle = new ContainerModule((bind) => {
  bind<IBookmarkService>(TYPES.IBookmarkService).to(BookmarkService);
  bind<IBookmarkRepository>(TYPES.IBookmarkRepository).to(BookmarkRepository);
});
