import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PlacePersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [PlacePersistenceModule],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService, PlacePersistenceModule],
})
export class PlacesModule {}
