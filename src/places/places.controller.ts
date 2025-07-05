import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PlaceService } from './places.service';
import { Place } from './domain/place';
import { QueryPlaceDto } from './dto/query-place.dto';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from 'src/utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { CreatePlaceDto } from './dto/create-place.dto';

@ApiTags('Places')
@Controller({
  path: 'place',
  version: '1',
})
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiOkResponse({
    type: InfinityPaginationResponse(Place),
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryPlaceDto,
  ): Promise<InfinityPaginationResponseDto<Place>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.placeService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiOkResponse({
    type: Place,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Place['id']): Promise<NullableType<Place>> {
    return this.placeService.findById(id);
  }

  @ApiCreatedResponse({
    type: Place,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.placeService.create(createPlaceDto);
  }

  @ApiOkResponse({
    type: Place,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Place['id'],
    @Body() updatePlaceDto: UpdatePlaceDto,
  ): Promise<Place | null> {
    return this.placeService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Place['id']): Promise<void> {
    return this.placeService.remove(id);
  }
}
