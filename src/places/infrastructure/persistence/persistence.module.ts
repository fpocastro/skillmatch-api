import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceRepository } from './repositories/place.repository';
import { PlaceEntity } from './entities/place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceEntity])],
  providers: [PlaceRepository],
  exports: [PlaceRepository],
})
export class PlacePersistenceModule {}
