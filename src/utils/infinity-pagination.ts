import { InfinityPaginationResponseDto } from './dto/infinity-pagination-response.dto';
import { IPaginationOptions } from './interfaces/pagination-options.interface';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
): InfinityPaginationResponseDto<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};
