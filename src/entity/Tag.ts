import { BaseEntity, Entity, ManyToMany, PrimaryColumn } from 'typeorm'
import { Post } from './Post'

@Entity('tag')
export class Tag extends BaseEntity {
  @PrimaryColumn('varchar', { length: 32, unique: true })
  name!: string
  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[] | null | undefined
}
