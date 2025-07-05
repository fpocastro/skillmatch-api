import { Injectable } from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { PlaceRepository } from './infrastructure/persistence/repositories/place.repository';
import { CreatePlaceDto } from './dto/create-place.dto';
import { Place } from './domain/place';
import { FilterPlaceDto, SortPlaceDto } from './dto/query-place.dto';
import { IPaginationOptions } from 'src/utils/interfaces/pagination-options.interface';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlaceService {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const place = new Place();

    place.name = createPlaceDto.name;
    place.description = createPlaceDto.description;
    place.address = createPlaceDto.address;
    place.isActive = createPlaceDto.isActive ?? true;

    return this.placeRepository.create(place);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPlaceDto | null;
    sortOptions?: SortPlaceDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Place[]> {
    return this.placeRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: Place['id']): Promise<NullableType<Place>> {
    return this.placeRepository.findById(id);
  }

  findManyByName(name: Place['name']): Promise<NullableType<Place[]>> {
    return this.placeRepository.findManyByName(name);
  }

  async update(
    id: Place['id'],
    updatePlaceDto: UpdatePlaceDto,
  ): Promise<Place | null> {
    return this.placeRepository.update(id, {
      name: updatePlaceDto.name,
      description: updatePlaceDto.description,
      address: updatePlaceDto.address,
      isActive: updatePlaceDto.isActive,
    });
  }

  async remove(id: Place['id']): Promise<void> {
    await this.placeRepository.remove(id);
  }
}
