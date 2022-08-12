export class PageInfiniteScrollInfoDto {
  itemsPerPage: number;
  nextId: number | null;

  /**
   * @param itemsPerPage 페이지당 아이템 수
   * @param nextId 다음 게시글 id
   */
  constructor(itemsPerPage: number, nextId: number | null) {
    this.itemsPerPage = itemsPerPage;
    this.nextId = nextId;
  }
}
