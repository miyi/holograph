import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'

@Entity('profile')
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string
  @Column('varchar', { length: 255, nullable: true })
  description: string | null | undefined
  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  }) // specify inverse side as a second parameter
  user!: User
}
