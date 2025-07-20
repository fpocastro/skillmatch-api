import { PlaceMapper } from '../../../../../src/places/infrastructure/persistence/mapper/place.mapper';
import { PlaceEntity } from '../../../../../src/places/infrastructure/persistence/entities/place.entity';
import { Place } from '../../../../../src/places/domain/place';

describe('PlaceMapper', () => {
  const testDate = new Date();

  describe('toDomain', () => {
    it('should map PlaceEntity to Place domain model', () => {
      const placeEntity = new PlaceEntity();
      placeEntity.id = 'test-id';
      placeEntity.name = 'Test Place';
      placeEntity.description = 'Test Description';
      placeEntity.address = 'Test Address';
      placeEntity.isActive = true;
      placeEntity.createdAt = testDate;
      placeEntity.updatedAt = testDate;

      const result = PlaceMapper.toDomain(placeEntity);

      expect(result).toBeInstanceOf(Place);
      expect(result.id).toBe(placeEntity.id);
      expect(result.name).toBe(placeEntity.name);
      expect(result.description).toBe(placeEntity.description);
      expect(result.address).toBe(placeEntity.address);
      expect(result.isActive).toBe(placeEntity.isActive);
      expect(result.createdAt).toBe(placeEntity.createdAt);
      expect(result.updatedAt).toBe(placeEntity.updatedAt);
      expect(result.deletedAt).toBe(placeEntity.deletedAt);
    });
  });

  describe('toPersistence', () => {
    it('should map Place domain model to PlaceEntity', () => {
      const place = new Place();
      place.id = 'test-id';
      place.name = 'Test Place';
      place.description = 'Test Description';
      place.address = 'Test Address';
      place.isActive = true;
      place.createdAt = testDate;
      place.updatedAt = testDate;

      const result = PlaceMapper.toPersistence(place);

      expect(result).toBeInstanceOf(PlaceEntity);
      expect(result.id).toBe(place.id);
      expect(result.name).toBe(place.name);
      expect(result.description).toBe(place.description);
      expect(result.address).toBe(place.address);
      expect(result.isActive).toBe(place.isActive);
      expect(result.createdAt).toBe(place.createdAt);
      expect(result.updatedAt).toBe(place.updatedAt);
      expect(result.deletedAt).toBe(place.deletedAt);
    });
  });
});
