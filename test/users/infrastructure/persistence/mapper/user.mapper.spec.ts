import { UserMapper } from 'src/users/infrastructure/persistence/mapper/user.mapper';
import { UserEntity } from 'src/users/infrastructure/persistence/entities/user.entity';
import { User } from 'src/users/domain/user';
import { Role } from 'src/roles/domain/role';
import { RoleEntity } from 'src/roles/infrastructure/persistence/entities/role.entity';

describe('UserMapper', () => {
  const testDate = new Date();

  const mockRole = new Role();
  mockRole.id = 'role-id';
  mockRole.name = 'user';
  mockRole.createdAt = testDate;
  mockRole.updatedAt = testDate;

  const mockRoleEntity = new RoleEntity();
  mockRoleEntity.id = 'role-id';
  mockRoleEntity.name = 'user';
  mockRoleEntity.createdAt = testDate;
  mockRoleEntity.updatedAt = testDate;

  describe('toDomain', () => {
    it('should map UserEntity to User domain model', () => {
      const userEntity = new UserEntity();
      userEntity.id = 'test-id';
      userEntity.sub = 'test-sub';
      userEntity.email = 'test@example.com';
      userEntity.firstName = 'John';
      userEntity.lastName = 'Doe';
      userEntity.role = mockRoleEntity;
      userEntity.createdAt = testDate;
      userEntity.updatedAt = testDate;

      const result = UserMapper.toDomain(userEntity);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(userEntity.id);
      expect(result.sub).toBe(userEntity.sub);
      expect(result.email).toBe(userEntity.email);
      expect(result.firstName).toBe(userEntity.firstName);
      expect(result.lastName).toBe(userEntity.lastName);
      expect(result.role).toEqual(
        expect.objectContaining({ id: 'role-id', name: 'user' }),
      );
      expect(result.createdAt).toBe(userEntity.createdAt);
      expect(result.updatedAt).toBe(userEntity.updatedAt);
      expect(result.deletedAt).toBe(userEntity.deletedAt);
    });
  });

  describe('toPersistence', () => {
    it('should map User domain model to UserEntity', () => {
      const user = new User();
      user.id = 'test-id';
      user.sub = 'test-sub';
      user.email = 'test@example.com';
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.role = mockRole;
      user.createdAt = testDate;
      user.updatedAt = testDate;

      const result = UserMapper.toPersistence(user);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result.id).toBe(user.id);
      expect(result.sub).toBe(user.sub);
      expect(result.email).toBe(user.email);
      expect(result.firstName).toBe(user.firstName);
      expect(result.lastName).toBe(user.lastName);
      expect(result.role).toEqual(
        expect.objectContaining({ id: 'role-id', name: 'user' }),
      );
      expect(result.createdAt).toBe(user.createdAt);
      expect(result.updatedAt).toBe(user.updatedAt);
      expect(result.deletedAt).toBe(user.deletedAt);
    });
  });
});
