import { ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export abstract class BaseService<DTO, CreateDTO> {
  abstract findAll(): Promise<DTO[] | null>;
  abstract findByName(name: string): Promise<DTO>;
  abstract findByNames(names: string[]): Promise<DTO[] | null>;
  abstract create(createDTO: CreateDTO): Promise<DTO>;
  abstract updateByName(name: string, createDTO: CreateDTO): Promise<DTO>;
  abstract removeByName(name: string): Promise<void>;

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