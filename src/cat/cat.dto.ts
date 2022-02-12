import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCatDTO {
    @ApiProperty()
    @IsNotEmpty()
    public name: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    public tailLength: number;
}

export class CatDTO {
    @ApiProperty()
    public name: string;

    @ApiProperty()
    public tailLength: number;
}