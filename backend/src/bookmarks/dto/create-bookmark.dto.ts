import { IsString, IsUrl, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @IsUrl({}, { message: 'Must be a valid URL starting with http:// or https://' })
  @IsNotEmpty()
  url: string;
}

