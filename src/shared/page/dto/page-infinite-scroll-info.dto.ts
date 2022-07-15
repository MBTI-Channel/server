export class PageInfiniteScrollInfoDto {
  totalCount: number;
  itemsPerPage: number;
  nextId: number | null;

  constructor(totalCount: number, itemsPerPage: number, nextId: number | null) {
    this.totalCount = totalCount;
    this.itemsPerPage = itemsPerPage;
    this.nextId = nextId;
  }
}
