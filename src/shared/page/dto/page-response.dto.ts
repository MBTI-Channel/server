export class PageResponseDto<PageInfo, Item> {
  pageInfo: PageInfo;
  items: Item[];

  constructor(pageInfo: PageInfo, items: Item[]) {
    this.pageInfo = pageInfo;
    this.items = items;
  }
}
