import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CatDTO, CreateCatDTO } from "src/cat/cat.dto";

export class CreateUserDTO {
    @ApiProperty()
    @IsNotEmpty()
    public name: string;

    @ApiProperty()
    public catNames: string[];
}

export class UserDTO {
    @ApiProperty()
    public name: string;

    @ApiProperty({
        type: 'array',
        items: { $ref: getSchemaPath(CatDTO) }
    })
    public cats: CatDTO[];
}