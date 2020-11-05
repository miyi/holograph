import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  OneToMany,
  CreateDateColumn,
} from 'typeorm'
import { hashSync } from 'bcryptjs'
import { Posts } from './Posts'

@Entity('user')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', { length: 255, unique: true })
  email!: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @Column('text', { nullable: true })
  password: string | undefined

  @Column('text', { nullable: true })
  twitterId: string | null | undefined

  @Column('text', { nullable: true })
  googleId: string | null | undefined

  @Column('bool', { default: false })
  confirm!: boolean

  @OneToMany(() => Posts, (posts) => posts.author)
  posts!: Posts[]

  @BeforeInsert()
  hashPassword() {
    if (this.password) this.password = hashSync(this.password, 12)
  }
}
