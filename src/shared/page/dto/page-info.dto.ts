export class PageInfoDto {
  totalCount: number;
  itemsPerPage: number;
  currentPage: number;
  totalPage: number;

  /**
   * @param totalCount   전체 아이템 수
   * @param itemsPerPage 페이지당 아이템 수
   * @param currentPage  현재 페이지
   * @param maxResults   페이지당 출력 아이템 수
   */
  constructor(
    totalCount: number,
    itemsPerPage: number,
    currentPage: number,
    maxResults: number
  ) {
    this.totalCount = totalCount;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = currentPage;
    this.totalPage = totalCount === 0 ? 1 : Math.ceil(totalCount / maxResults);
  }
}
