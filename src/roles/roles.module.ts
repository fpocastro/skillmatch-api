import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolePersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [RolePersistenceModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService, RolePersistenceModule],
})
export class RolesModule {}
