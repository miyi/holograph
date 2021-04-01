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
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm'
import { Post } from './Post'
import { Profile } from './Profile'
import { Pub } from './Pub'

@Entity('user')
export class User extends BaseEntity {
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

  @Column('bool', { nullable: false, default: false })
  deactivated!: boolean

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  @JoinColumn()
  profile!: Profile

  @ManyToMany(() => Post, {
    cascade: true
  })
  @JoinTable()
  collection!: Post[]

  @OneToMany(() => Post, (posts) => posts.author, {
    cascade: true,
  })
  posts!: Post[]

  @ManyToMany(() => Pub, pub => pub.mods)
  modOf?: Pub[]

  @BeforeInsert()
  hashPassword() {
    if (this.password) this.password = hashSync(this.password, 12)
  }
  @BeforeInsert()
  async createProfile() {
    this.profile = await Profile.create().save()
  }
}
