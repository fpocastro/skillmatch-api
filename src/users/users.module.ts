import { Module } from '@nestjs/common';
import { UserPersistenceModule } from './infrastructure/persistence/persistence.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [UserPersistenceModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, UserPersistenceModule],
})
export class UsersModule {}
