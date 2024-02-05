import {
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  isNumber,
} from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  offset?: number;
}
