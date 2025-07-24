import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/infrastructure/persistence/repositories/user.repository';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/domain/user';
import { Role } from 'src/roles/domain/role';
import { RolesEnum } from 'src/roles/enums/roles.enum';
import { SortUserDto } from 'src/users/dto/query-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    findManyWithPagination: jest.fn(),
    findById: jest.fn(),
    findBySub: jest.fn(),
    findByEmail: jest.fn(),
    findManyByName: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRolesService = {
    findByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        sub: 'test-sub',
        firstName: 'John',
        lastName: 'Doe',
      };

      const userRole = new Role();
      userRole.name = RolesEnum.USER;

      const expectedUser = new User();
      expectedUser.email = createUserDto.email;
      expectedUser.sub = createUserDto.sub;
      expectedUser.firstName = createUserDto.firstName;
      expectedUser.lastName = createUserDto.lastName;
      expectedUser.role = userRole;

      const createdUser = new User();
      Object.assign(createdUser, expectedUser, { id: 'test-id' });

      mockRolesService.findByName.mockResolvedValue(userRole);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(mockRolesService.findByName).toHaveBeenCalledWith(RolesEnum.USER);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createUserDto.email,
          sub: createUserDto.sub,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          role: userRole,
        }),
      );
      expect(result).toEqual(createdUser);
    });

    it('should throw InternalServerErrorException if user role not found', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        sub: 'test-sub',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockRolesService.findByName.mockResolvedValue(null);

      await expect(service.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockRolesService.findByName).toHaveBeenCalledWith(RolesEnum.USER);
    });
  });

  describe('findManyWithPagination', () => {
    it('should return paginated users', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const filterOptions = { firstName: 'John' };
      const sortOption: SortUserDto = { orderBy: 'firstName', order: 'ASC' };
      const sortOptions = [sortOption];

      const users = [new User(), new User()];
      mockUserRepository.findManyWithPagination.mockResolvedValue(users);

      const result = await service.findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
      });

      expect(mockUserRepository.findManyWithPagination).toHaveBeenCalledWith({
        filterOptions,
        sortOptions,
        paginationOptions,
      });
      expect(result).toEqual(users);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const userId = 'test-id';
      const user = new User();
      user.id = userId;

      mockUserRepository.findById.mockResolvedValue(user);

      const result = await service.findById(userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });
  });

  describe('findBySub', () => {
    it('should return a user by sub', async () => {
      const userSub = 'test-sub';
      const user = new User();
      user.sub = userSub;

      mockUserRepository.findBySub.mockResolvedValue(user);

      const result = await service.findBySub(userSub);

      expect(mockUserRepository.findBySub).toHaveBeenCalledWith(userSub);
      expect(result).toEqual(user);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const userEmail = 'test@example.com';
      const user = new User();
      user.email = userEmail;

      mockUserRepository.findByEmail.mockResolvedValue(user);

      const result = await service.findByEmail(userEmail);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userEmail);
      expect(result).toEqual(user);
    });
  });

  describe('findManyByName', () => {
    it('should return users by name', async () => {
      const name = 'John Doe';
      const users = [new User(), new User()];

      mockUserRepository.findManyByName.mockResolvedValue(users);

      const result = await service.findManyByName(name);

      expect(mockUserRepository.findManyByName).toHaveBeenCalledWith(name);
      expect(result).toEqual(users);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 'test-id';
      const data = {
        email: 'updated@example.com',
        firstName: 'Updated',
        lastName: 'User',
      };

      const updateUserDto: UpdateUserDto = data;
      const updatedUser = new User();
      updatedUser.id = userId;
      updatedUser.email = data.email;
      updatedUser.firstName = data.firstName;
      updatedUser.lastName = data.lastName;

      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        email: updateUserDto.email,
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 'test-id';
      mockUserRepository.remove.mockResolvedValue(undefined);

      await service.remove(userId);

      expect(mockUserRepository.remove).toHaveBeenCalledWith(userId);
    });
  });
});
