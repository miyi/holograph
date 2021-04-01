import { User } from './User'
import { PubInfo } from './PubInfo'
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('pub')
class Pub extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string
  @Column('varchar', { length: 32, unique: true })
  name!: string
  @Column('varchar', { length: 255, nullable: true })
  description: string | null | undefined
  @OneToOne(() => PubInfo, (pubInfo) => pubInfo.pub, {
    cascade: true,
  })
  info!: PubInfo

  @ManyToMany(() => User, (user) => user.modOf, {
    cascade: true,
  })
  @JoinTable()
  mods!: User[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date

  @BeforeInsert()
  async createPubInfo() {
    this.info = await PubInfo.create().save()
  }
}

export { Pub }
