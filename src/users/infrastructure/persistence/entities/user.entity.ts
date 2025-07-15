import { RoleEntity } from 'src/roles/infrastructure/persistence/entities/role.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String, unique: true })
  sub: string;

  @Column({ type: String, unique: true, nullable: false })
  email: string;

  @Column({ name: 'first_name', type: String, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: String, nullable: false })
  lastName: string;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role: RoleEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
