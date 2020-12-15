import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm'
import { Post } from './Post'
import { User } from './User'

@Entity('profile')
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string
  @Column('varchar', { length: 255, nullable: true })
  description: string | null | undefined

  @ManyToMany(() => Post)
  @JoinTable()
  collection!: Post[]
  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  }) // specify inverse side as a second parameter
  user!: User
}
