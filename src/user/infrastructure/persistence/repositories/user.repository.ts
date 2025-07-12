import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/interfaces/pagination-options.interface';
import { UserEntity } from '../entities/user.entity';
import { User } from 'src/user/domain/user';
import { UserMapper } from '../mapper/user.mapper';
import { FilterUserDto, SortUserDto } from 'src/user/dto/query-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    const where: FindOptionsWhere<UserEntity> = {};

    where.firstName = filterOptions?.firstName;
    where.lastName = filterOptions?.lastName;

    const entities = await this.userRepository.find({
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

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findManyByName(name: string): Promise<NullableType<User[]>> {
    const qb = this.userRepository.createQueryBuilder('user');

    const terms = name.trim().split(/\s+/);

    if (terms.length === 1) {
      qb.where('LOWER(user.firstName) LIKE LOWER(:term)', {
        term: `%${terms[0]}%`,
      }).orWhere('LOWER(user.lastName) LIKE LOWER(:term)', {
        term: `%${terms[0]}%`,
      });
    } else if (terms.length >= 2) {
      const fullName = terms.join(' ');
      qb.where(
        "LOWER(CONCAT(user.firstName, ' ', user.lastName)) LIKE LOWER(:fullName)",
        {
          fullName: `%${fullName}%`,
        },
      );
    }

    const entities = await qb.getMany();
    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { id },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findBySub(sub: User['sub']): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { sub },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { email },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const newEntity = await this.userRepository.save(
      this.userRepository.create(persistenceModel),
    );

    return UserMapper.toDomain(newEntity);
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.userRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = await this.userRepository.save(
      this.userRepository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async remove(id: User['id']): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
