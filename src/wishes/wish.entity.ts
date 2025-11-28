import { IsDataURI, Length } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
  })
  @Length(1, 250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsDataURI()
  image: string;

  @Column({
    type: 'numeric',
    scale: 2,
  })
  price: number;

  @Column({
    type: 'numeric',
    scale: 2,
  })
  raised: number;

  @Column({
    type: 'varchar',
  })
  @Length(1, 1024)
  description: string;

  @Column({
    type: 'numeric',
    scale: 0,
  })
  copied: number;
}