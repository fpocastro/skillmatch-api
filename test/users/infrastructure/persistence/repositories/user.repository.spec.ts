import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/infrastructure/persistence/repositories/user.repository';
import { UserEntity } from 'src/users/infrastructure/persistence/entities/user.entity';
import { User } from 'src/users/domain/user';
import { Role } from 'src/roles/domain/role';
import { RoleEntity } from 'src/roles/infrastructure/persistence/entities/role.entity';
import { SortUserDto } from 'src/users/dto/query-user.dto';

describe('UserRepository', () => {
  let repository: UserRepository;

  const mockRole = new Role();
  mockRole.id = 'role-id';
  mockRole.name = 'user';

  const mockRoleEntity = new RoleEntity();
  mockRoleEntity.id = 'role-id';
  mockRoleEntity.name = 'user';

  const mockUser = new User();
  mockUser.id = 'test-id';
  mockUser.sub = 'test-sub';
  mockUser.email = 'test@example.com';
  mockUser.firstName = 'John';
  mockUser.lastName = 'Doe';
  mockUser.role = mockRole;
  mockUser.createdAt = new Date();
  mockUser.updatedAt = new Date();

  const mockUserEntity = new UserEntity();
  mockUserEntity.id = 'test-id';
  mockUserEntity.sub = 'test-sub';
  mockUserEntity.email = 'test@example.com';
  mockUserEntity.firstName = 'John';
  mockUserEntity.lastName = 'Doe';
  mockUserEntity.role = mockRoleEntity;
  mockUserEntity.createdAt = mockUser.createdAt;
  mockUserEntity.updatedAt = mockUser.updatedAt;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockTypeormRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockTypeormRepository,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findManyWithPagination', () => {
    it('should return paginated users', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const filterOptions = { firstName: 'John' };
      const sortOption: SortUserDto = { orderBy: 'firstName', order: 'ASC' };
      const sortOptions = [sortOption];

      mockTypeormRepository.find.mockResolvedValue([mockUserEntity]);

      const result = await repository.findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
      });

      expect(mockTypeormRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { firstName: 'John', lastName: undefined },
        order: { firstName: 'ASC' },
      });
      expect(result).toEqual([expect.objectContaining({ id: 'test-id' })]);
    });
  });

  describe('findManyByName', () => {
    it('should return users by single name term', async () => {
      const name = 'John';
      mockTypeormRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
      mockQueryBuilder.getMany.mockResolvedValue([mockUserEntity]);

      const result = await repository.findManyByName(name);

      expect(mockTypeormRepository.createQueryBuilder).toHaveBeenCalledWith(
        'user',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'LOWER(user.firstName) LIKE LOWER(:term)',
        { term: '%John%' },
      );
      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith(
        'LOWER(user.lastName) LIKE LOWER(:term)',
        { term: '%John%' },
      );
      expect(result).toEqual([expect.objectContaining({ id: 'test-id' })]);
    });

    it('should return users by full name', async () => {
      const name = 'John Doe';
      mockTypeormRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
      mockQueryBuilder.getMany.mockResolvedValue([mockUserEntity]);

      const result = await repository.findManyByName(name);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        "LOWER(CONCAT(user.firstName, ' ', user.lastName)) LIKE LOWER(:fullName)",
        { fullName: '%John Doe%' },
      );
      expect(result).toEqual([expect.objectContaining({ id: 'test-id' })]);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const userId = 'test-id';
      mockTypeormRepository.findOne.mockResolvedValue(mockUserEntity);

      const result = await repository.findById(userId);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(expect.objectContaining({ id: userId }));
    });

    it('should return null if user not found', async () => {
      const userId = 'non-existent-id';
      mockTypeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(userId);

      expect(result).toBeNull();
    });
  });

  describe('findBySub', () => {
    it('should return a user by sub', async () => {
      const userSub = 'test-sub';
      mockTypeormRepository.findOne.mockResolvedValue(mockUserEntity);

      const result = await repository.findBySub(userSub);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { sub: userSub },
      });
      expect(result).toEqual(expect.objectContaining({ sub: userSub }));
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const userEmail = 'test@example.com';
      mockTypeormRepository.findOne.mockResolvedValue(mockUserEntity);

      const result = await repository.findByEmail(userEmail);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { email: userEmail },
      });
      expect(result).toEqual(expect.objectContaining({ email: userEmail }));
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockTypeormRepository.create.mockReturnValue(mockUserEntity);
      mockTypeormRepository.save.mockResolvedValue(mockUserEntity);

      const result = await repository.create(mockUser);

      expect(mockTypeormRepository.create).toHaveBeenCalled();
      expect(mockTypeormRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ id: 'test-id' }));
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 'test-id';
      const updateData = {
        email: 'updated@example.com',
        firstName: 'Updated',
      };

      const updatedEntity = { ...mockUserEntity, ...updateData };

      mockTypeormRepository.findOne.mockResolvedValue(mockUserEntity);
      mockTypeormRepository.create.mockReturnValue(updatedEntity);
      mockTypeormRepository.save.mockResolvedValue(updatedEntity);

      const result = await repository.update(userId, updateData);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockTypeormRepository.save).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          id: userId,
          email: 'updated@example.com',
          firstName: 'Updated',
        }),
      );
    });

    it('should throw an error if user not found', async () => {
      const userId = 'non-existent-id';
      mockTypeormRepository.findOne.mockResolvedValue(null);

      await expect(
        repository.update(userId, { email: 'updated@example.com' }),
      ).rejects.toThrow('User not found');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 'test-id';
      mockTypeormRepository.softDelete.mockResolvedValue(undefined);

      await repository.remove(userId);

      expect(mockTypeormRepository.softDelete).toHaveBeenCalledWith(userId);
    });
  });
});
