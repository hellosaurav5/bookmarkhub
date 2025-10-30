import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { VoteDto } from './dto/vote.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
  ) {}

  async vote(userId: number, voteDto: VoteDto) {
    const { bookmarkId, voteType } = voteDto;

    // If voteType is 0, remove the vote
    if (voteType === 0) {
      await this.votesRepository.delete({ userId, bookmarkId });
      return { message: 'Vote removed' };
    }

    // Check if vote exists
    const existingVote = await this.votesRepository.findOne({
      where: { userId, bookmarkId },
    });

    if (existingVote) {
      // Update existing vote
      existingVote.voteType = voteType;
      await this.votesRepository.save(existingVote);
      return existingVote;
    } else {
      // Create new vote
      const vote = this.votesRepository.create({
        userId,
        bookmarkId,
        voteType,
      });
      return this.votesRepository.save(vote);
    }
  }

  async getUserVote(userId: number, bookmarkId: number): Promise<Vote | null> {
    return this.votesRepository.findOne({
      where: { userId, bookmarkId },
    });
  }
}

