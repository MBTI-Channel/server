export class PageInfoDto {
  totalCount: number;
  itemsPerPage: number;
  currentPage: number;
  totalPage: number;

  constructor(totalCount: number, itemsPerPage: number, currentPage: number) {
    this.totalCount = totalCount;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = currentPage;
    this.totalPage = Math.ceil(totalCount / itemsPerPage);
  }
}
