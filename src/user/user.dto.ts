import { IObjectWithTypegooseFunction } from "@typegoose/typegoose/lib/types";
import { Model, QueryWithHelpers } from "mongoose";
import { Cat } from "src/cat/cat.model";
import { CatService } from "src/cat/cat.service";
import { User } from "./user.model";

export interface UserDTO {
    name: string,
    cats: Cat[]
}

function createUserDTO(user: User, cats: Cat[]): UserDTO {
    const populatedUser = {
        ...user,
        cats
    };
    delete populatedUser.catNames;
    return populatedUser;
}

const catsCache = {};

export async function convertUserToDTO(user: User, catService: CatService): Promise<UserDTO> {
    const unCachedCats = user.catNames.filter(name => !catsCache[name]);
    
    if (unCachedCats) {
        (await catService.findByNames(unCachedCats))
            .forEach(cat => {
                catsCache[cat.name] = cat;
            });
    }

    return createUserDTO(user, user.catNames.map(name => catsCache[name]));
}

export async function convertUsersToDTO(users: User[], catService: CatService): Promise<UserDTO[]> {
    return await Promise.all(users.map(user => convertUserToDTO(user, catService)))
}

