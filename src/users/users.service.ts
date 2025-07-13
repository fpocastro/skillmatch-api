import { Injectable } from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/interfaces/pagination-options.interface';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { User } from './domain/user';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.email = createUserDto.email;
    user.sub = createUserDto.sub;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return this.userRepository.create(user);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.userRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.userRepository.findById(id);
  }

  findBySub(sub: User['sub']): Promise<NullableType<User>> {
    return this.userRepository.findBySub(sub);
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.userRepository.findByEmail(email);
  }

  findManyByName(name: string): Promise<NullableType<User[]>> {
    return this.userRepository.findManyByName(name);
  }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userRepository.update(id, {
      email: updateUserDto.email,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
    });
  }

  async remove(id: User['id']): Promise<void> {
    await this.userRepository.remove(id);
  }
}
