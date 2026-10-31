import zod from "zod";
import { numericInput } from "./zodRules";
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export type PaginationSearchParams = Partial<
  Record<keyof PaginationParams, string | null | number>
>;

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  firstPage: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResult<T> {
  rows: T[];
  meta: PaginationMeta;
}

export const FIRST_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MIN_LIMIT = 1;
export const MAX_LIMIT = 100;
export function getPaginationParams(
  paginationParams: PaginationParams = {},
): Required<PaginationParams & { skip: number }> {
  const { page, limit } = paginationParams;
  const currentPage = Math.max(FIRST_PAGE, page ?? FIRST_PAGE);
  const itemsPerPage = Math.max(1, limit ?? DEFAULT_LIMIT);

  return {
    page: currentPage,
    limit: itemsPerPage,
    skip: (currentPage - 1) * itemsPerPage,
  };
}

export function buildPaginatedResult<T>(
  data: T[],
  option: { currentPage: number; limit: number; totalItems: number },
): PaginatedResult<T> {
  const { currentPage, limit, totalItems } = option;
  const totalPages = Math.ceil(totalItems / limit);

  const meta: PaginationMeta = {
    totalItems,
    itemCount: data.length,
    itemsPerPage: limit,
    totalPages,
    currentPage,
    startIndex: (currentPage - 1) * limit + 1,
    endIndex: Math.min(currentPage * limit, totalItems),
    firstPage: FIRST_PAGE,
    lastPage: totalPages,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };

  return { rows: data, meta };
}

export const paginationSchema = zod.object({
  page: numericInput()
    .int("La page doit etre un entier")
    .min(FIRST_PAGE, `Le page doit etre superieure à ${FIRST_PAGE}`)
    .optional()
    .default(1),
  limit: numericInput()
    .int()
    .min(MIN_LIMIT, `la limite doit superieure à ${MIN_LIMIT}`)
    .max(MAX_LIMIT, `la limite doit inferieure à ${MAX_LIMIT}`)
    .optional()
    .default(DEFAULT_LIMIT),
});
