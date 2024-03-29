import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalDto {
  @IsString()
  @ApiProperty({
    example: 'This is my goal',
    description: 'Example of goal',
  })
  readonly content: string;

  @IsDate()
  @ApiProperty({
    example: '2021-09-30T00:00:00.000Z',
    description: 'Date of goal'
  })
  readonly dueDate: Date;
}
