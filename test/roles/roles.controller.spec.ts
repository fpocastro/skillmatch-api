import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from 'src/roles/roles.controller';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/domain/role';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';

describe('RolesController', () => {
  let controller: RolesController;

  const mockRolesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const roles = [new Role(), new Role()];
      mockRolesService.findAll.mockResolvedValue(roles);

      const result = await controller.findAll();

      expect(mockRolesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(roles);
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const roleId = 'test-id';
      const role = new Role();
      role.id = roleId;

      mockRolesService.findById.mockResolvedValue(role);

      const result = await controller.findOne(roleId);

      expect(mockRolesService.findById).toHaveBeenCalledWith(roleId);
      expect(result).toEqual(role);
    });
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'test-role',
        description: 'Test Role Description',
      };

      const createdRole = new Role();
      Object.assign(createdRole, createRoleDto, { id: 'test-id' });

      mockRolesService.create.mockResolvedValue(createdRole);

      const result = await controller.create(createRoleDto);

      expect(mockRolesService.create).toHaveBeenCalledWith(createRoleDto);
      expect(result).toEqual(createdRole);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const roleId = 'test-id';
      const updateRoleDto = {
        name: 'updated-role',
        description: 'Updated Role Description',
      };

      const updatedRole = new Role();
      updatedRole.id = roleId;
      Object.assign(updatedRole, updateRoleDto);

      mockRolesService.update.mockResolvedValue(updatedRole);

      const result = await controller.update(roleId, updateRoleDto);

      expect(mockRolesService.update).toHaveBeenCalledWith(
        roleId,
        updateRoleDto,
      );
      expect(result).toEqual(updatedRole);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const roleId = 'test-id';
      mockRolesService.remove.mockResolvedValue(undefined);

      await controller.remove(roleId);

      expect(mockRolesService.remove).toHaveBeenCalledWith(roleId);
    });
  });
});
