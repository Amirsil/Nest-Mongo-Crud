import { ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export abstract class BaseService<Model, CreateDTO> {
  abstract findAll(): Promise<Model[] | null>;
  abstract findByName(name: string): Promise<Model>;
  abstract findByNames(names: string[]): Promise<Model[] | null>;
  abstract create(createDTO: CreateDTO): Promise<Model>;
  abstract updateByName(name: string, createDTO: CreateDTO): Promise<Model>;
  abstract removeByName(name: string): Promise<Model>

  protected async validateExists(name: string): Promise<void> {
    try {
      await this.findByName(name)
    } catch (err) {
      throw new ForbiddenException(`${name} doesn't exist`);
    }
  }

  protected async validateNoDuplicates(name: string): Promise<void> {
    try {
      await this.findByName(name)
    } catch (err) {
      return
    }
    throw new ForbiddenException(`${name} already exists`);
  }

  protected async validateNameIsLegal(name: string): Promise<void> {
    const illegalCharacters = /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;

    if (illegalCharacters.test(name) ) {
      throw new ForbiddenException(`name contains illegal characters`)
    }
  }
}