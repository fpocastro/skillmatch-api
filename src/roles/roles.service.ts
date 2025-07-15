import { Injectable } from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { RoleRepository } from './infrastructure/persistence/repositories/role.repository';
import { Role } from './domain/role';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role();

    role.name = createRoleDto.name;
    role.description = createRoleDto.description;

    return this.roleRepository.create(role);
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  findById(id: Role['id']): Promise<NullableType<Role>> {
    return this.roleRepository.findById(id);
  }

  findByName(name: Role['name']): Promise<NullableType<Role>> {
    return this.roleRepository.findByName(name);
  }

  async update(
    id: Role['id'],
    updateData: Partial<Role>,
  ): Promise<Role | null> {
    return this.roleRepository.update(id, updateData);
  }

  async remove(id: Role['id']): Promise<void> {
    await this.roleRepository.remove(id);
  }
}
