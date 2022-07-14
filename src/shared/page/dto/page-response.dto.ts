export class PageResponseDto<Page, Item> {
  pageInfo: Page;
  items: Item[];

  constructor(pageInfo: Page, items: Item[]) {
    this.pageInfo = pageInfo;
    this.items = items;
  }
}
