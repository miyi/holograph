import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  OneToMany,
  CreateDateColumn,
  OneToOne,
  UpdateDateColumn,
  AfterInsert,
} from 'typeorm'
import { hashSync } from 'bcryptjs'
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
    onDelete: 'CASCADE',
  })
  profile!: Profiles

  @OneToMany(() => Posts, (posts) => posts.author, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  posts!: Posts[]

  @BeforeInsert()
  hashPassword() {
    if (this.password) this.password = hashSync(this.password, 12)
  }

  @AfterInsert()
  async createProfile() {
    let profile = await Profiles.create().save()
    this.profile = profile
    this.save()
  }
}
