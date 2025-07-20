import { Test, TestingModule } from '@nestjs/testing';
import { PlacesController } from '../../src/places/places.controller';
import { PlacesService } from '../../src/places/places.service';
import { Place } from '../../src/places/domain/place';
import { CreatePlaceDto } from '../../src/places/dto/create-place.dto';
import { UpdatePlaceDto } from '../../src/places/dto/update-place.dto';
import { QueryPlaceDto } from '../../src/places/dto/query-place.dto';

describe('PlacesController', () => {
  let controller: PlacesController;

  const mockPlacesService = {
    create: jest.fn(),
    findManyWithPagination: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [
        {
          provide: PlacesService,
          useValue: mockPlacesService,
        },
      ],
    }).compile();

    controller = module.get<PlacesController>(PlacesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated places', async () => {
      const query: QueryPlaceDto = {
        page: 1,
        limit: 10,
        filters: { name: 'Test' },
        sort: [{ orderBy: 'name' as keyof Place, order: 'ASC' }],
      };

      const places = [new Place(), new Place()];
      mockPlacesService.findManyWithPagination.mockResolvedValue(places);

      const result = await controller.findAll(query);

      expect(mockPlacesService.findManyWithPagination).toHaveBeenCalledWith({
        filterOptions: query.filters,
        sortOptions: query.sort,
        paginationOptions: {
          page: query.page,
          limit: query.limit,
        },
      });
      expect(result).toEqual({
        data: places,
        hasNextPage: false,
      });
    });

    it('should limit to 50 items per page', async () => {
      const query: QueryPlaceDto = {
        page: 1,
        limit: 100,
      };

      const places = Array(50).fill(new Place());
      mockPlacesService.findManyWithPagination.mockResolvedValue(places);

      await controller.findAll(query);

      expect(mockPlacesService.findManyWithPagination).toHaveBeenCalledWith({
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
      const places = [new Place(), new Place()];
      mockPlacesService.findManyWithPagination.mockResolvedValue(places);

      await controller.findAll(query as QueryPlaceDto);

      expect(mockPlacesService.findManyWithPagination).toHaveBeenCalledWith({
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
    it('should return a place by id', async () => {
      const placeId = 'test-id';
      const place = new Place();
      place.id = placeId;

      mockPlacesService.findById.mockResolvedValue(place);

      const result = await controller.findOne(placeId);

      expect(mockPlacesService.findById).toHaveBeenCalledWith(placeId);
      expect(result).toEqual(place);
    });
  });

  describe('create', () => {
    it('should create a new place', async () => {
      const createPlaceDto: CreatePlaceDto = {
        name: 'Test Place',
        description: 'Test Description',
        address: 'Test Address',
        isActive: true,
      };

      const createdPlace = new Place();
      Object.assign(createdPlace, createPlaceDto, { id: 'test-id' });

      mockPlacesService.create.mockResolvedValue(createdPlace);

      const result = await controller.create(createPlaceDto);

      expect(mockPlacesService.create).toHaveBeenCalledWith(createPlaceDto);
      expect(result).toEqual(createdPlace);
    });
  });

  describe('update', () => {
    it('should update a place', async () => {
      const placeId = 'test-id';
      const updatePlaceDto: UpdatePlaceDto = {
        name: 'Updated Place',
        description: 'Updated Description',
        address: 'Updated Address',
        isActive: false,
      };

      const updatedPlace = new Place();
      updatedPlace.id = placeId;
      Object.assign(updatedPlace, updatePlaceDto);

      mockPlacesService.update.mockResolvedValue(updatedPlace);

      const result = await controller.update(placeId, updatePlaceDto);

      expect(mockPlacesService.update).toHaveBeenCalledWith(
        placeId,
        updatePlaceDto,
      );
      expect(result).toEqual(updatedPlace);
    });
  });

  describe('remove', () => {
    it('should remove a place', async () => {
      const placeId = 'test-id';
      mockPlacesService.remove.mockResolvedValue(undefined);

      await controller.remove(placeId);

      expect(mockPlacesService.remove).toHaveBeenCalledWith(placeId);
    });
  });
});
