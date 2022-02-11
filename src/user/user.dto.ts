import { ApiProperty } from "@nestjs/swagger";

export class UserDTO {
    @ApiProperty()
    public name: string;

    @ApiProperty()
    public catNames: string[];
}