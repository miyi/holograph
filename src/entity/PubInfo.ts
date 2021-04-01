import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
} from 'typeorm'
import { Pub } from './Pub'

//pubInfo is a placeholder entity for pub customization information
@Entity('pubInfo')
class PubInfo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string
  @Column('varchar', {length: 255, nullable: true})
  details: string | null | undefined
  @OneToOne(() => Pub, (pub) => pub.info)
  pub!: Pub
}

export { PubInfo }
