import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';

@Entity('votes')
export class Vote {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'bookmark_id' })
  bookmarkId: number;

  @Column({ name: 'vote_type' })
  voteType: number; // -1 or 1

  @ManyToOne(() => User, (user) => user.votes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Bookmark, (bookmark) => bookmark.votes)
  @JoinColumn({ name: 'bookmark_id' })
  bookmark: Bookmark;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

