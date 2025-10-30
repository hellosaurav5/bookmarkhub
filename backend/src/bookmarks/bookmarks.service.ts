import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
  ) {}

  async create(userId: number, createBookmarkDto: CreateBookmarkDto) {
    const bookmark = this.bookmarksRepository.create({
      ...createBookmarkDto,
      userId,
    });
    const savedBookmark = await this.bookmarksRepository.save(bookmark);

    // Fetch the complete bookmark with user info and vote counts
    const query = `
      SELECT 
        b.id,
        b.title,
        b.url,
        b.created_at as "createdAt",
        u.email as "createdBy",
        COALESCE(SUM(v.vote_type), 0)::INTEGER as "voteCount",
        uv.vote_type as "userVote"
      FROM bookmarks b
      INNER JOIN users u ON b.user_id = u.id
      LEFT JOIN votes v ON b.id = v.bookmark_id
      LEFT JOIN votes uv ON b.id = uv.bookmark_id AND uv.user_id = $1
      WHERE b.id = $2
      GROUP BY b.id, b.title, b.url, b.created_at, u.email, uv.vote_type
    `;

    const result = await this.bookmarksRepository.query(query, [userId, savedBookmark.id]);
    return result[0];
  }

  async findAll(userId?: number) {
    const query = `
      SELECT 
        b.id,
        b.title,
        b.url,
        b.created_at as "createdAt",
        u.email as "createdBy",
        COALESCE(SUM(v.vote_type), 0)::INTEGER as "voteCount",
        uv.vote_type as "userVote"
      FROM bookmarks b
      INNER JOIN users u ON b.user_id = u.id
      LEFT JOIN votes v ON b.id = v.bookmark_id
      LEFT JOIN votes uv ON b.id = uv.bookmark_id AND uv.user_id = $1
      GROUP BY b.id, b.title, b.url, b.created_at, u.email, uv.vote_type
      ORDER BY b.created_at DESC
    `;

    return this.bookmarksRepository.query(query, [userId || null]);
  }

  async findOne(id: number): Promise<Bookmark | null> {
    return this.bookmarksRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}

