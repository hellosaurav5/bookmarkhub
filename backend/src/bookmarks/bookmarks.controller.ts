import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Public } from '../auth/decorators/public.decorator';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user?.userId || null;
    return this.bookmarksService.findAll(userId);
  }

  @Post()
  async create(@Req() req: any, @Body() createBookmarkDto: CreateBookmarkDto) {
    const userId = req.user.userId;
    return this.bookmarksService.create(userId, createBookmarkDto);
  }
}

