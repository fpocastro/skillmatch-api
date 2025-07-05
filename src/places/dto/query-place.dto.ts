import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { Place } from '../domain/place';

export class FilterPlaceDto {
  @ApiProperty()
  @Type(() => String)
  @IsOptional()
  @IsString()
  name?: string;
}

export class SortPlaceDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Place;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryPlaceDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value
      ? plainToInstance(FilterPlaceDto, JSON.parse(value as string))
      : undefined,
  )
  @ValidateNested()
  @Type(() => FilterPlaceDto)
  filters?: FilterPlaceDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortPlaceDto, JSON.parse(value as string))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortPlaceDto)
  sort?: SortPlaceDto[] | null;
}
