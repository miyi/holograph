import { hashSync } from 'bcryptjs'
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Posts } from './Posts'
import { Profiles } from './Profiles'

@Entity('user')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', { length: 255, unique: true })
  email!: string

  @Column('varchar', { length: 255 })
  password: string | undefined

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date

  @Column('text', { nullable: true })
  twitterId: string | null | undefined

  @Column('text', { nullable: true })
  googleId: string | null | undefined

  @Column('bool', { default: false })
  confirm!: boolean

  @Column('bool', { nullable: false, default: true })
  deactivated!: boolean

  @OneToOne(() => Profiles, (profile) => profile.user, {
    cascade: true,
  })
  profile!: Profiles

  @OneToMany(() => Posts, (posts) => posts.author, {
    cascade: true,
  })
  posts!: Posts[]

  @BeforeInsert()
  hashPassword() {
    if (this.password) this.password = hashSync(this.password, 12)
  }
  @BeforeInsert()
  async createProfile() {
    this.profile = await Profiles.create().save()
  }

  // @BeforeRemove()
  // async removeProfile() {
  //   await Profiles.remove(this.profile)
  // }
}
