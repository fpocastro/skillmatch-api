import { UserEntity } from '../entities/user.entity';
import { User } from 'src/users/domain/user';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();

    domainEntity.id = raw.id;
    domainEntity.sub = raw.sub;
    domainEntity.email = raw.email;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
    const persistenceEntity = new UserEntity();

    persistenceEntity.id = domainEntity.id;
    persistenceEntity.sub = domainEntity.sub;
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.firstName = domainEntity.firstName;
    persistenceEntity.lastName = domainEntity.lastName;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    return persistenceEntity;
  }
}
