export class PageInfiniteScrollInfoDto {
  totalCount: number;
  itemsPerPage: number;
  nextId: number;

  constructor(totalCount: number, itemsPerPage: number, nextId: number) {
    this.totalCount = totalCount;
    this.itemsPerPage = itemsPerPage;
    this.nextId = nextId;
  }
}
