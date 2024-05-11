import { IsDate, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeDto {
  @IsString()
  @ApiProperty({
    example: 'Married',
    description: 'Category of challenge',
  })
  readonly category: string;

  @IsString()
  @ApiProperty({
    example: 'This is my challenge',
    description: 'Example of challenge name',
  })
  readonly name: string;

  @IsString()
  @ApiProperty({
    example: 'This is my challenge',
    description: 'Example of challenge description',
  })
  readonly description: string;

  @IsDate()
  @ApiProperty({
    example: '2021-09-30T00:00:00.000Z',
    description: 'Date of challenge',
  })
  readonly date: Date;

  @IsNumber()
  @ApiProperty({
    example: '20000000',
    description: 'Target amount of challenge',
  })
  readonly target: number;

  @IsNumber()
  @ApiProperty({
    example: '2000000',
    description: 'Saved money of challenge',
  })
  readonly current: number;
}

export class ContributeChallengeDto {
  @IsNumber()
  @ApiProperty({
    example: 100,
    description: 'Amount of money to contribute',
  })
  readonly amount: number;
}

export class SendRequestToFriendDto {
  @IsNumber()
  @ApiProperty({
    example: '65f7393f2ec109eac4370c68',
    description: 'Friend id',
  })
  readonly id: string;
}
