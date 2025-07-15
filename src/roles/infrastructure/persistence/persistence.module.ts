import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './repositories/role.repository';
import { RoleEntity } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleRepository],
  exports: [RoleRepository],
})
export class RolePersistenceModule {}
