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
  
    @Column('varchar', { length: 255 })
    email!: string
  
    @Column('text')
    password!: string
  
    @Column('bool', { default: false })
    confirm!: boolean
  
    @BeforeInsert()
    hashPassword() {
      this.password = hashSync(this.password, 12)
    }
  }