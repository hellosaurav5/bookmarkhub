import { IsInt, IsIn } from 'class-validator';

export class VoteDto {
  @IsInt()
  bookmarkId: number;

  @IsInt()
  @IsIn([-1, 0, 1], { message: 'Vote type must be -1 (downvote), 0 (remove vote), or 1 (upvote)' })
  voteType: number;
}

