import { Module } from '@nestjs/common';
import { PlaceController } from './places.controller';
import { PlaceService } from './places.service';
import { PlacePersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [PlacePersistenceModule],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [PlaceService, PlacePersistenceModule],
})
export class PlaceModule {}
