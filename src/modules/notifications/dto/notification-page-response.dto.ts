import { PageResponseDto } from "../../../shared/page";

export class NotificationPageResponseDto<Page, Item> extends PageResponseDto<
  Page,
  Item
> {
  totalUnreadCount: number;
  constructor(totalUnreadCount: number, pageInfo: Page, items: Item[]) {
    super(pageInfo, items);
    this.totalUnreadCount = totalUnreadCount;
  }
}
