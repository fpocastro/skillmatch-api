import { Module } from '@nestjs/common';
import { UserPersistenceModule } from './infrastructure/persistence/persistence.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [UserPersistenceModule, RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, UserPersistenceModule],
})
export class UsersModule {}
