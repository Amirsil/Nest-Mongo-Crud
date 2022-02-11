import { IObjectWithTypegooseFunction } from "@typegoose/typegoose/lib/types";
import { Model, QueryWithHelpers } from "mongoose";
import { Cat } from "src/cat/cat.model";
import { CatService } from "src/cat/cat.service";
import { User } from "./user.model";

export interface UserDTO {
    name: string,
    cats: Cat[]
}


export async function convertUserToDTO(user: User, catService: CatService): Promise<UserDTO> {
    const cats = await catService.findByNames(user.catNames);
    const populatedUser = {
        ...user,
        cats
    };
    delete populatedUser.catNames;
    return populatedUser;
}