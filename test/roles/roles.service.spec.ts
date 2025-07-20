import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from 'src/roles/roles.service';
import { RoleRepository } from 'src/roles/infrastructure/persistence/repositories/role.repository';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { Role } from 'src/roles/domain/role';

describe('RolesService', () => {
  let service: RolesService;

  const mockRoleRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: RoleRepository,
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'test-role',
        description: 'Test Role Description',
      };

      const expectedRole = new Role();
      expectedRole.name = createRoleDto.name;
      expectedRole.description = createRoleDto.description;

      const createdRole = new Role();
      Object.assign(createdRole, expectedRole, { id: 'test-id' });

      mockRoleRepository.create.mockResolvedValue(createdRole);

      const result = await service.create(createRoleDto);

      expect(mockRoleRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createRoleDto.name,
          description: createRoleDto.description,
        }),
      );
      expect(result).toEqual(createdRole);
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const roles = [new Role(), new Role()];
      mockRoleRepository.findAll.mockResolvedValue(roles);

      const result = await service.findAll();

      expect(mockRoleRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(roles);
    });
  });

  describe('findById', () => {
    it('should return a role by id', async () => {
      const roleId = 'test-id';
      const role = new Role();
      role.id = roleId;

      mockRoleRepository.findById.mockResolvedValue(role);

      const result = await service.findById(roleId);

      expect(mockRoleRepository.findById).toHaveBeenCalledWith(roleId);
      expect(result).toEqual(role);
    });

    it('should return null if role not found', async () => {
      const roleId = 'non-existent-id';
      mockRoleRepository.findById.mockResolvedValue(null);

      const result = await service.findById(roleId);

      expect(mockRoleRepository.findById).toHaveBeenCalledWith(roleId);
      expect(result).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return a role by name', async () => {
      const roleName = 'admin';
      const role = new Role();
      role.name = roleName;

      mockRoleRepository.findByName.mockResolvedValue(role);

      const result = await service.findByName(roleName);

      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(roleName);
      expect(result).toEqual(role);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const roleId = 'test-id';
      const updateData = {
        name: 'updated-role',
        description: 'Updated Role Description',
      };

      const updatedRole = new Role();
      updatedRole.id = roleId;
      updatedRole.name = updateData.name;
      updatedRole.description = updateData.description;

      mockRoleRepository.update.mockResolvedValue(updatedRole);

      const result = await service.update(roleId, updateData);

      expect(mockRoleRepository.update).toHaveBeenCalledWith(
        roleId,
        updateData,
      );
      expect(result).toEqual(updatedRole);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const roleId = 'test-id';
      mockRoleRepository.remove.mockResolvedValue(undefined);

      await service.remove(roleId);

      expect(mockRoleRepository.remove).toHaveBeenCalledWith(roleId);
    });
  });
});
