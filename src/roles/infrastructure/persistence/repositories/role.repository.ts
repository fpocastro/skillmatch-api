import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';
import { RoleMapper } from '../mapper/role.mapper';
import { Role } from 'src/roles/domain/role';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async findAll(): Promise<Role[]> {
    const entities = await this.roleRepository.find();

    return entities.map((role) => RoleMapper.toDomain(role));
  }

  async findById(id: Role['id']): Promise<NullableType<Role>> {
    const entity = await this.roleRepository.findOne({
      where: { id },
    });

    return entity ? RoleMapper.toDomain(entity) : null;
  }

  async findByName(name: Role['name']): Promise<NullableType<Role>> {
    const entity = await this.roleRepository.findOne({
      where: { name },
    });

    return entity ? RoleMapper.toDomain(entity) : null;
  }

  async create(data: Role): Promise<Role> {
    const persistenceModel = RoleMapper.toPersistence(data);
    const newEntity = await this.roleRepository.save(
      this.roleRepository.create(persistenceModel),
    );

    return RoleMapper.toDomain(newEntity);
  }

  async update(id: Role['id'], payload: Partial<Role>): Promise<Role> {
    const entity = await this.roleRepository.findOne({ where: { id } });

    if (!entity) {
      throw new Error('Role not found');
    }

    const updatedEntity = await this.roleRepository.save(
      this.roleRepository.create(
        RoleMapper.toPersistence({
          ...RoleMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RoleMapper.toDomain(updatedEntity);
  }

  async remove(id: Role['id']): Promise<void> {
    await this.roleRepository.softDelete(id);
  }
}
