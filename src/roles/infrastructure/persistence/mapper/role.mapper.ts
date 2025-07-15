import { Role } from 'src/roles/domain/role';
import { RoleEntity } from '../entities/role.entity';

export class RoleMapper {
  static toDomain(raw: RoleEntity): Role {
    const domainEntity = new Role();

    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Role): RoleEntity {
    const persistenceEntity = new RoleEntity();

    persistenceEntity.id = domainEntity.id;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    return persistenceEntity;
  }
}
