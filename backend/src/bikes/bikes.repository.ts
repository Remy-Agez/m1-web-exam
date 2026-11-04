import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, QueryFailedError } from "typeorm";
import { BikeSellEntity } from "../customers/entities/bike-sell.entity";
import type {
  PageModel,
  PaginationModel,
} from "../shared/models/pagination.model";
import { BikeEntity } from "./entities/bike.entity";
import type {
  BikeModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";
import {
  BikeInUseError,
  BikeNotFoundError,
} from "./models/persistence-error.model";

@Injectable()
export class BikesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAll({
    page,
    limit,
  }: PaginationModel): Promise<PageModel<BikeModel>> {
    const [entities, totalCount] = await this.dataSource
      .getRepository(BikeEntity)
      .findAndCount({
        order: { brand: "ASC", model: "ASC", id: "ASC" },
        skip: (page - 1) * limit,
        take: limit,
      });
    return {
      totalCount,
      items: entities.map((entity) => this.toBikeModel(entity)),
    };
  }

  async findById(id: string): Promise<BikeModel | null> {
    const entity = await this.dataSource
      .getRepository(BikeEntity)
      .findOneBy({ id });
    return entity ? this.toBikeModel(entity) : null;
  }

  async create(input: CreateBikeModel): Promise<BikeModel> {
    const repository = this.dataSource.getRepository(BikeEntity);
    return this.toBikeModel(await repository.save(repository.create(input)));
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(BikeEntity);
      const entity = await repository.findOneBy({ id });
      if (!entity) throw new BikeNotFoundError();
      repository.merge(entity, input);
      return this.toBikeModel(await repository.save(entity));
    });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(BikeEntity);
        if (!(await repository.existsBy({ id }))) throw new BikeNotFoundError();
        // Sales keep a reference to the bike: deleting it would lose their history.
        if (
          await manager.getRepository(BikeSellEntity).existsBy({ bikeId: id })
        )
          throw new BikeInUseError();
        await repository.delete(id);
      });
    } catch (error) {
      this.translateError(error);
    }
  }

  private translateError(error: unknown): never {
    // Safety net: the foreign key on bike_sells also forbids the deletion.
    if (
      error instanceof QueryFailedError &&
      error.message.includes("FOREIGN KEY constraint failed")
    ) {
      throw new BikeInUseError();
    }
    throw error;
  }

  private toBikeModel(entity: BikeEntity): BikeModel {
    return {
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      description: entity.description,
      category: entity.category,
      frameMaterial: entity.frameMaterial,
      frameSizeCm: entity.frameSizeCm,
      wheelSizeInches: entity.wheelSizeInches,
      gearCount: entity.gearCount,
      weightKg: entity.weightKg,
      electric: entity.electric,
      priceCents: entity.priceCents,
    };
  }
}
