import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlaceRepository } from '../../../../../src/places/infrastructure/persistence/repositories/place.repository';
import { PlaceEntity } from '../../../../../src/places/infrastructure/persistence/entities/place.entity';
import { Place } from '../../../../../src/places/domain/place';
import { SortPlaceDto } from 'src/places/dto/query-place.dto';

describe('PlaceRepository', () => {
  let repository: PlaceRepository;

  const mockPlace = new Place();
  mockPlace.id = 'test-id';
  mockPlace.name = 'Test Place';
  mockPlace.description = 'Test Description';
  mockPlace.address = 'Test Address';
  mockPlace.isActive = true;
  mockPlace.createdAt = new Date();
  mockPlace.updatedAt = new Date();

  const mockPlaceEntity = new PlaceEntity();
  mockPlaceEntity.id = 'test-id';
  mockPlaceEntity.name = 'Test Place';
  mockPlaceEntity.description = 'Test Description';
  mockPlaceEntity.address = 'Test Address';
  mockPlaceEntity.isActive = true;
  mockPlaceEntity.createdAt = mockPlace.createdAt;
  mockPlaceEntity.updatedAt = mockPlace.updatedAt;

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
        PlaceRepository,
        {
          provide: getRepositoryToken(PlaceEntity),
          useValue: mockTypeormRepository,
        },
      ],
    }).compile();

    repository = module.get<PlaceRepository>(PlaceRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findManyWithPagination', () => {
    it('should return paginated places', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const filterOptions = { name: 'Test' };
      const sortOption: SortPlaceDto = { orderBy: 'name', order: 'ASC' };
      const sortOptions = [sortOption];

      mockTypeormRepository.find.mockResolvedValue([mockPlaceEntity]);

      const result = await repository.findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
      });

      expect(mockTypeormRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { name: 'Test' },
        order: { name: 'ASC' },
      });
      expect(result).toEqual([expect.objectContaining({ id: 'test-id' })]);
    });
  });

  describe('findManyByName', () => {
    it('should return places by name', async () => {
      const placeName = 'Test Place';
      mockTypeormRepository.find.mockResolvedValue([mockPlaceEntity]);

      const result = await repository.findManyByName(placeName);

      expect(mockTypeormRepository.find).toHaveBeenCalledWith({
        where: { name: placeName },
      });
      expect(result).toEqual([expect.objectContaining({ id: 'test-id' })]);
    });
  });

  describe('findById', () => {
    it('should return a place by id', async () => {
      const placeId = 'test-id';
      mockTypeormRepository.findOne.mockResolvedValue(mockPlaceEntity);

      const result = await repository.findById(placeId);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: placeId },
      });
      expect(result).toEqual(expect.objectContaining({ id: placeId }));
    });

    it('should return null if place not found', async () => {
      const placeId = 'non-existent-id';
      mockTypeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(placeId);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: placeId },
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new place', async () => {
      mockTypeormRepository.create.mockReturnValue(mockPlaceEntity);
      mockTypeormRepository.save.mockResolvedValue(mockPlaceEntity);

      const result = await repository.create(mockPlace);

      expect(mockTypeormRepository.create).toHaveBeenCalled();
      expect(mockTypeormRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ id: 'test-id' }));
    });
  });

  describe('update', () => {
    it('should update a place', async () => {
      const placeId = 'test-id';
      const updateData = {
        name: 'Updated Place',
        description: 'Updated Description',
      };

      const updatedEntity = { ...mockPlaceEntity, ...updateData };

      mockTypeormRepository.findOne.mockResolvedValue(mockPlaceEntity);
      mockTypeormRepository.create.mockReturnValue(updatedEntity);
      mockTypeormRepository.save.mockResolvedValue(updatedEntity);

      const result = await repository.update(placeId, updateData);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: placeId },
      });
      expect(mockTypeormRepository.save).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          id: placeId,
          name: 'Updated Place',
          description: 'Updated Description',
        }),
      );
    });

    it('should throw an error if place not found', async () => {
      const placeId = 'non-existent-id';
      mockTypeormRepository.findOne.mockResolvedValue(null);

      await expect(
        repository.update(placeId, { name: 'Updated' }),
      ).rejects.toThrow('Place not found');
    });
  });

  describe('remove', () => {
    it('should remove a place', async () => {
      const placeId = 'test-id';
      mockTypeormRepository.softDelete.mockResolvedValue(undefined);

      await repository.remove(placeId);

      expect(mockTypeormRepository.softDelete).toHaveBeenCalledWith(placeId);
    });
  });
});
