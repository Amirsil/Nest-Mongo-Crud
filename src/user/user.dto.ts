import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CatDTO } from "src/cat/cat.dto";

export class UserDTO {
    @ApiProperty()
    @IsNotEmpty()
    public name: string;

    @ApiProperty()
    public catNames: string[];
}