import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Posts } from './Posts'

@Entity('profile')
export class Profiles extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string
  @Column('varchar', {length: 255, nullable: true})
  description: string | undefined
  
  @ManyToMany(() => Posts, {
    cascade: ['insert']
  })
  @JoinTable()
  collection?: Posts[]
}
