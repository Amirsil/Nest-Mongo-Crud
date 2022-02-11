import { ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export abstract class BaseService<T, DTO> {
  abstract findAll(): Promise<T[] | null>;
  abstract findByName(name: string): Promise<T>;
  abstract findByNames(names: string[]): Promise<T[] | null>;
  abstract create(dto: DTO): Promise<T>;
  abstract updateByName(name: string, dto: DTO): Promise<T>;
  abstract removeByName(name: string): Promise<T>

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
}