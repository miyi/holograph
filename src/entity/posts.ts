import { Users } from './Users';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm'

@Entity('posts')
export class Posts extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', { length: 255, unique: true })
  title!: string

  @Column('varchar', { nullable: true })
  body: string | undefined

  @ManyToOne(() => Users, users => users.posts )
  author!: Users

  @Column('bool', { default: false })
  published!: boolean
}

// @Entity('postBody')
// export class PostBody extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id!: string

//   @Column('varchar', { length: 255, unique: true })
//   title!: string

//   @Column('varchar', { nullable: true })
//   body: string | undefined

//   @Column('text', { nullable: true })
//   points: string | null | undefined

//   @ManyToOne(() => Users, users => users.posts )
//   author!: Users
// }