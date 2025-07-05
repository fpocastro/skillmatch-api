import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PlaceEntity } from '../entities/place.entity';
import { Place } from 'src/places/domain/place';
import { NullableType } from 'src/utils/types/nullable.type';
import { PlaceMapper } from '../mapper/place.mapper';
import { IPaginationOptions } from 'src/utils/interfaces/pagination-options.interface';
import { FilterPlaceDto, SortPlaceDto } from 'src/places/dto/query-place.dto';

@Injectable()
export class PlaceRepository {
  constructor(
    @InjectRepository(PlaceEntity)
    private readonly placeRepository: Repository<PlaceEntity>,
  ) {}

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPlaceDto | null;
    sortOptions?: SortPlaceDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Place[]> {
    const where: FindOptionsWhere<PlaceEntity> = {};

    where.name = filterOptions?.name;

    const entities = await this.placeRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((place) => PlaceMapper.toDomain(place));
  }

  async findManyByName(name: Place['name']): Promise<NullableType<Place[]>> {
    const entities = await this.placeRepository.find({
      where: { name },
    });

    return entities.map((place) => PlaceMapper.toDomain(place));
  }

  async findById(id: Place['id']): Promise<NullableType<Place>> {
    const entity = await this.placeRepository.findOne({
      where: { id },
    });

    return entity ? PlaceMapper.toDomain(entity) : null;
  }

  async create(data: Place): Promise<Place> {
    const persistenceModel = PlaceMapper.toPersistence(data);
    const newEntity = await this.placeRepository.save(
      this.placeRepository.create(persistenceModel),
    );

    return PlaceMapper.toDomain(newEntity);
  }

  async update(id: Place['id'], payload: Partial<Place>): Promise<Place> {
    const entity = await this.placeRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Place not found');
    }

    const updatedEntity = await this.placeRepository.save(
      this.placeRepository.create(
        PlaceMapper.toPersistence({
          ...PlaceMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PlaceMapper.toDomain(updatedEntity);
  }

  async remove(id: Place['id']): Promise<void> {
    await this.placeRepository.softDelete(id);
  }
}
