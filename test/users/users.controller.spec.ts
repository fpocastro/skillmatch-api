import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/domain/user';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { QueryUserDto } from 'src/users/dto/query-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findManyWithPagination: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const query: QueryUserDto = {
        page: 1,
        limit: 10,
        filters: { firstName: 'John' },
        sort: [{ orderBy: 'firstName' as keyof User, order: 'ASC' }],
      };

      const users = [new User(), new User()];
      mockUsersService.findManyWithPagination.mockResolvedValue(users);

      const result = await controller.findAll(query);

      expect(mockUsersService.findManyWithPagination).toHaveBeenCalledWith({
        filterOptions: query.filters,
        sortOptions: query.sort,
        paginationOptions: {
          page: query.page,
          limit: query.limit,
        },
      });
      expect(result).toEqual({
        data: users,
        hasNextPage: false,
      });
    });

    it('should limit to 50 items per page', async () => {
      const query: QueryUserDto = {
        page: 1,
        limit: 100,
      };

      const users = Array(50).fill(new User());
      mockUsersService.findManyWithPagination.mockResolvedValue(users);

      await controller.findAll(query);

      expect(mockUsersService.findManyWithPagination).toHaveBeenCalledWith({
        filterOptions: undefined,
        sortOptions: undefined,
        paginationOptions: {
          page: 1,
          limit: 50,
        },
      });
    });

    it('should use default pagination if not provided', async () => {
      const query = {};
      const users = [new User(), new User()];
      mockUsersService.findManyWithPagination.mockResolvedValue(users);

      await controller.findAll(query as QueryUserDto);

      expect(mockUsersService.findManyWithPagination).toHaveBeenCalledWith({
        filterOptions: undefined,
        sortOptions: undefined,
        paginationOptions: {
          page: 1,
          limit: 10,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 'test-id';
      const user = new User();
      user.id = userId;

      mockUsersService.findById.mockResolvedValue(user);

      const result = await controller.findOne(userId);

      expect(mockUsersService.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        sub: 'test-sub',
        firstName: 'John',
        lastName: 'Doe',
      };

      const createdUser = new User();
      Object.assign(createdUser, createUserDto, { id: 'test-id' });

      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 'test-id';
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        firstName: 'Updated',
        lastName: 'User',
      };

      const updatedUser = new User();
      updatedUser.id = userId;
      Object.assign(updatedUser, updateUserDto);

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(userId, updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 'test-id';
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove(userId);

      expect(mockUsersService.remove).toHaveBeenCalledWith(userId);
    });
  });
});
