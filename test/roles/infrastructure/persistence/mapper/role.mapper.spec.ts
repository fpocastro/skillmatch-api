import { RoleMapper } from 'src/roles/infrastructure/persistence/mapper/role.mapper';
import { RoleEntity } from 'src/roles/infrastructure/persistence/entities/role.entity';
import { Role } from 'src/roles/domain/role';

describe('RoleMapper', () => {
  const testDate = new Date();

  describe('toDomain', () => {
    it('should map RoleEntity to Role domain model', () => {
      const roleEntity = new RoleEntity();
      roleEntity.id = 'test-id';
      roleEntity.name = 'test-role';
      roleEntity.description = 'Test Role Description';
      roleEntity.createdAt = testDate;
      roleEntity.updatedAt = testDate;

      const result = RoleMapper.toDomain(roleEntity);

      expect(result).toBeInstanceOf(Role);
      expect(result.id).toBe(roleEntity.id);
      expect(result.name).toBe(roleEntity.name);
      expect(result.description).toBe(roleEntity.description);
      expect(result.createdAt).toBe(roleEntity.createdAt);
      expect(result.updatedAt).toBe(roleEntity.updatedAt);
      expect(result.deletedAt).toBe(roleEntity.deletedAt);
    });
  });

  describe('toPersistence', () => {
    it('should map Role domain model to RoleEntity', () => {
      const role = new Role();
      role.id = 'test-id';
      role.name = 'test-role';
      role.description = 'Test Role Description';
      role.createdAt = testDate;
      role.updatedAt = testDate;

      const result = RoleMapper.toPersistence(role);

      expect(result).toBeInstanceOf(RoleEntity);
      expect(result.id).toBe(role.id);
      expect(result.name).toBe(role.name);
      expect(result.description).toBe(role.description);
      expect(result.createdAt).toBe(role.createdAt);
      expect(result.updatedAt).toBe(role.updatedAt);
      expect(result.deletedAt).toBe(role.deletedAt);
    });
  });
});
