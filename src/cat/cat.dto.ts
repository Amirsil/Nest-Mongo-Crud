import { ApiProperty } from "@nestjs/swagger";

export class CatDTO {
    @ApiProperty()
    public name: string;

    @ApiProperty()
    public tailLength: number;
}

