import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleRepository } from 'src/roles/infrastructure/persistence/repositories/role.repository';
import { RoleEntity } from 'src/roles/infrastructure/persistence/entities/role.entity';
import { Role } from 'src/roles/domain/role';

describe('RoleRepository', () => {
  let repository: RoleRepository;

  const mockRole = new Role();
  mockRole.id = 'test-id';
  mockRole.name = 'test-role';
  mockRole.description = 'Test Role Description';
  mockRole.createdAt = new Date();
  mockRole.updatedAt = new Date();

  const mockRoleEntity = new RoleEntity();
  mockRoleEntity.id = 'test-id';
  mockRoleEntity.name = 'test-role';
  mockRoleEntity.description = 'Test Role Description';
  mockRoleEntity.createdAt = mockRole.createdAt;
  mockRoleEntity.updatedAt = mockRole.updatedAt;

  const mockTypeormRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleRepository,
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: mockTypeormRepository,
        },
      ],
    }).compile();

    repository = module.get<RoleRepository>(RoleRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      mockTypeormRepository.find.mockResolvedValue([mockRoleEntity]);

      const result = await repository.findAll();

      expect(mockTypeormRepository.find).toHaveBeenCalled();
      expect(result).toEqual([expect.objectContaining({ id: 'test-id' })]);
    });
  });

  describe('findById', () => {
    it('should return a role by id', async () => {
      const roleId = 'test-id';
      mockTypeormRepository.findOne.mockResolvedValue(mockRoleEntity);

      const result = await repository.findById(roleId);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: roleId },
      });
      expect(result).toEqual(expect.objectContaining({ id: roleId }));
    });

    it('should return null if role not found', async () => {
      const roleId = 'non-existent-id';
      mockTypeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(roleId);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: roleId },
      });
      expect(result).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return a role by name', async () => {
      const roleName = 'test-role';
      mockTypeormRepository.findOne.mockResolvedValue(mockRoleEntity);

      const result = await repository.findByName(roleName);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { name: roleName },
      });
      expect(result).toEqual(expect.objectContaining({ name: roleName }));
    });
  });

  describe('create', () => {
    it('should create a new role', async () => {
      mockTypeormRepository.create.mockReturnValue(mockRoleEntity);
      mockTypeormRepository.save.mockResolvedValue(mockRoleEntity);

      const result = await repository.create(mockRole);

      expect(mockTypeormRepository.create).toHaveBeenCalled();
      expect(mockTypeormRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ id: 'test-id' }));
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const roleId = 'test-id';
      const updateData = {
        name: 'updated-role',
        description: 'Updated Role Description',
      };

      const updatedEntity = { ...mockRoleEntity, ...updateData };

      mockTypeormRepository.findOne.mockResolvedValue(mockRoleEntity);
      mockTypeormRepository.create.mockReturnValue(updatedEntity);
      mockTypeormRepository.save.mockResolvedValue(updatedEntity);

      const result = await repository.update(roleId, updateData);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: roleId },
      });
      expect(mockTypeormRepository.save).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          id: roleId,
          name: 'updated-role',
          description: 'Updated Role Description',
        }),
      );
    });

    it('should throw an error if role not found', async () => {
      const roleId = 'non-existent-id';
      mockTypeormRepository.findOne.mockResolvedValue(null);

      await expect(
        repository.update(roleId, { name: 'updated' }),
      ).rejects.toThrow('Role not found');
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const roleId = 'test-id';
      mockTypeormRepository.softDelete.mockResolvedValue(undefined);

      await repository.remove(roleId);

      expect(mockTypeormRepository.softDelete).toHaveBeenCalledWith(roleId);
    });
  });
});
