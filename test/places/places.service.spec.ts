import { Test, TestingModule } from '@nestjs/testing';
import { PlacesService } from '../../src/places/places.service';
import { PlaceRepository } from '../../src/places/infrastructure/persistence/repositories/place.repository';
import { CreatePlaceDto } from '../../src/places/dto/create-place.dto';
import { Place } from '../../src/places/domain/place';
import { UpdatePlaceDto } from '../../src/places/dto/update-place.dto';
import { SortPlaceDto } from 'src/places/dto/query-place.dto';

describe('PlacesService', () => {
  let service: PlacesService;

  const mockPlaceRepository = {
    create: jest.fn(),
    findManyWithPagination: jest.fn(),
    findById: jest.fn(),
    findManyByName: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesService,
        {
          provide: PlaceRepository,
          useValue: mockPlaceRepository,
        },
      ],
    }).compile();

    service = module.get<PlacesService>(PlacesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new place', async () => {
      const data = {
        name: 'Test Place',
        description: 'Test Description',
        address: 'Test Address',
        isActive: true,
      };

      const createPlaceDto: CreatePlaceDto = data;

      const expectedPlace = new Place();
      expectedPlace.name = data.name;
      expectedPlace.description = data.description;
      expectedPlace.address = data.address;
      expectedPlace.isActive = data.isActive;

      const createdPlace = new Place();
      Object.assign(createdPlace, expectedPlace, { id: 'test-id' });

      mockPlaceRepository.create.mockResolvedValue(createdPlace);

      const result = await service.create(createPlaceDto);

      expect(mockPlaceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createPlaceDto.name,
          description: createPlaceDto.description,
          address: createPlaceDto.address,
          isActive: createPlaceDto.isActive,
        }),
      );
      expect(result).toEqual(createdPlace);
    });

    it('should set isActive to true by default if not provided', async () => {
      const createPlaceDto: CreatePlaceDto = {
        name: 'Test Place',
        description: 'Test Description',
        address: 'Test Address',
      };

      const expectedPlace = new Place();
      expectedPlace.name = createPlaceDto.name;
      expectedPlace.description = createPlaceDto.description;
      expectedPlace.address = createPlaceDto.address;
      expectedPlace.isActive = true;

      const createdPlace = new Place();
      Object.assign(createdPlace, expectedPlace, { id: 'test-id' });

      mockPlaceRepository.create.mockResolvedValue(createdPlace);

      const result = await service.create(createPlaceDto);

      expect(mockPlaceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: true,
        }),
      );
      expect(result).toEqual(createdPlace);
    });
  });

  describe('findManyWithPagination', () => {
    it('should return paginated places', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const filterOptions = { name: 'Test' };
      const sortOption: SortPlaceDto = { orderBy: 'name', order: 'ASC' };
      const sortOptions = [sortOption];

      const places = [new Place(), new Place()];
      mockPlaceRepository.findManyWithPagination.mockResolvedValue(places);

      const result = await service.findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
      });

      expect(mockPlaceRepository.findManyWithPagination).toHaveBeenCalledWith({
        filterOptions,
        sortOptions,
        paginationOptions,
      });
      expect(result).toEqual(places);
    });
  });

  describe('findById', () => {
    it('should return a place by id', async () => {
      const placeId = 'test-id';
      const place = new Place();
      place.id = placeId;

      mockPlaceRepository.findById.mockResolvedValue(place);

      const result = await service.findById(placeId);

      expect(mockPlaceRepository.findById).toHaveBeenCalledWith(placeId);
      expect(result).toEqual(place);
    });

    it('should return null if place not found', async () => {
      const placeId = 'non-existent-id';
      mockPlaceRepository.findById.mockResolvedValue(null);

      const result = await service.findById(placeId);

      expect(mockPlaceRepository.findById).toHaveBeenCalledWith(placeId);
      expect(result).toBeNull();
    });
  });

  describe('findManyByName', () => {
    it('should return places by name', async () => {
      const placeName = 'Test Place';
      const places = [new Place(), new Place()];
      places.forEach((place) => (place.name = placeName));

      mockPlaceRepository.findManyByName.mockResolvedValue(places);

      const result = await service.findManyByName(placeName);

      expect(mockPlaceRepository.findManyByName).toHaveBeenCalledWith(
        placeName,
      );
      expect(result).toEqual(places);
    });
  });

  describe('update', () => {
    it('should update a place', async () => {
      const placeId = 'test-id';
      const data = {
        name: 'Updated Place',
        description: 'Updated Description',
        address: 'Updated Address',
        isActive: false,
      };

      const updatePlaceDto: UpdatePlaceDto = data;
      const updatedPlace = new Place();
      updatedPlace.id = placeId;
      updatedPlace.name = data.name;
      updatedPlace.description = data.description;
      updatedPlace.address = data.address;
      updatedPlace.isActive = data.isActive;

      mockPlaceRepository.update.mockResolvedValue(updatedPlace);

      const result = await service.update(placeId, updatePlaceDto);

      expect(mockPlaceRepository.update).toHaveBeenCalledWith(placeId, {
        name: updatePlaceDto.name,
        description: updatePlaceDto.description,
        address: updatePlaceDto.address,
        isActive: updatePlaceDto.isActive,
      });
      expect(result).toEqual(updatedPlace);
    });
  });

  describe('remove', () => {
    it('should remove a place', async () => {
      const placeId = 'test-id';
      mockPlaceRepository.remove.mockResolvedValue(undefined);

      await service.remove(placeId);

      expect(mockPlaceRepository.remove).toHaveBeenCalledWith(placeId);
    });
  });
});
