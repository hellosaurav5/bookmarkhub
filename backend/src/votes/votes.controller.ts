import { Controller, Post, Body, Req } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VoteDto } from './dto/vote.dto';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  async vote(@Req() req: any, @Body() voteDto: VoteDto) {
    const userId = req.user.userId;
    return this.votesService.vote(userId, voteDto);
  }
}

