import { Module } from '@nestjs/common';
import { UserPersistenceModule } from './infrastructure/persistence/persistence.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserPersistenceModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserPersistenceModule],
})
export class UserModule {}
