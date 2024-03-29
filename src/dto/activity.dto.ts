import { IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
    @IsString()
    @ApiProperty({
        example: 'Shopping',
        description: 'Example of activity category',
    })
    readonly category: string;

    @IsString()
    @ApiProperty({
        example: 'Buy bicycles',
        description: 'Example of acivity',
    })
    readonly content: string;

    @IsDate()
    @ApiProperty({
        example: '2021-09-30T00:00:00.000Z',
        description: 'Date of goal'
    })
    readonly createdAt: Date;

    @IsNumber()
    @ApiProperty({
        example: '2000000',
        description: 'Amount of activity'
    })
    readonly amount: number;
}
