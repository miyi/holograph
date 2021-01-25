import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Post } from './Post'

@Entity('tag')
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string
  @Column('char', { length: 16, unique: true })
  searchKey!: string
  @Column('varchar', { length: 16 })
  name!: string
  @ManyToMany(() => Post, (post) => post.tags)
	posts: Post[] | null | undefined
	
	count?: number

  @BeforeInsert()
  setSearchKey() {
    if (!this.searchKey) {
      this.searchKey = this.name.replace(/\s/g, '').toLocaleLowerCase()
    }
  }
}
