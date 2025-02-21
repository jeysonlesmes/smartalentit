export class PaginatedResultDto<T> {
  constructor(
    public readonly items: T[],
    public readonly total: number,
    public readonly pageIndex: number,
    public readonly pageSize: number,
    public readonly totalPages: number
  ) { }

  static create<T>(
    items: T[],
    total: number,
    pageIndex: number,
    pageSize: number,
  ): PaginatedResultDto<T> {
    const totalPages = Math.ceil(total / pageSize);

    return new PaginatedResultDto(items, total, pageIndex, pageSize, totalPages);
  }
}