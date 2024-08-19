export interface VercelPagination {
  /** Amount of items in the current page. */
  count: number,
  /** Timestamp that must be used to request the next page. */
  next: number | null,
  /** Timestamp that must be used to request the previous page. */
  prev: number | null
}
