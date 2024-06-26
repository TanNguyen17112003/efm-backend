import { IsDate, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalDto {
  @IsString()
  @ApiProperty({
    example: 'Married',
    description: 'Category of goal',
  })
  readonly category: string;

  @IsString()
  @ApiProperty({
    example: 'This is my goal',
    description: 'Example of goal',
  })
  readonly title: string;

  @IsDate()
  @ApiProperty({
    example: '2021-09-30T00:00:00.000Z',
    description: 'Date of goal'
  })
  readonly date: Date;

  @IsNumber()
  @ApiProperty({
    example: '20000000',
    description: 'Target amount of goal'
  })
  readonly target: number;

  @IsNumber()
  @ApiProperty({
    example: '2000000',
    description: 'Saved money of goal'
  })
  readonly current: number;
}
