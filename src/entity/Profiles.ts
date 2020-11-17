import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm'
import { Posts } from './Posts'
import { Users } from './Users'

@Entity('profile')
export class Profiles extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string
  @Column('varchar', { length: 255, nullable: true })
  description: string | undefined
  @ManyToMany(() => Posts)
  @JoinTable()
  collection?: Posts[]
  @OneToOne(() => Users, (user) => user.profile, {
    onDelete: 'CASCADE'
  }) // specify inverse side as a second parameter
  user!: Users
}
