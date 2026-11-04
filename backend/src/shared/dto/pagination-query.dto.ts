import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

// Query parameters arrive as strings: @Type converts them before validation,
// so "abc", "1.5", "0" or "-2" are rejected with a 400.
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}
