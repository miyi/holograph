import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
} from 'typeorm'
import { hashSync } from 'bcryptjs'

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', { length: 255, unique: true })
  email!: string

  @Column('text', { nullable: true })
  password: string | undefined

  @Column('text', { nullable: true })
  twitterId: string | null | undefined

  @Column('text', { nullable: true })
  googleId: string | null | undefined

  @Column('bool', { default: false })
  confirm!: boolean

  @BeforeInsert()
  hashPassword() {
    if (this.password) this.password = hashSync(this.password, 12)
  }
}
