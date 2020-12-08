import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Posts } from './Posts'
import { Users } from './Users'

@Entity('profile')
export class Profiles extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string
  @Column('varchar', { length: 255, nullable: true })
  description: string | null | undefined
  @ManyToMany(() => Posts)
  @JoinTable()
  collection!: Posts[]

  @OneToOne(() => Users, (user) => user.profile) // specify inverse side as a second parameter
  @JoinColumn()
  user!: Users
}
