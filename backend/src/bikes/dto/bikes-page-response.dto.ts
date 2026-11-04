import type { PageModel } from "../../shared/models/pagination.model";
import type { BikeModel } from "../models/bike.model";
import { BikeResponseDto } from "./bike-response.dto";

export class BikesPageResponseDto {
  totalCount: number;
  bikes: BikeResponseDto[];

  static fromModel(model: PageModel<BikeModel>): BikesPageResponseDto {
    return Object.assign(new BikesPageResponseDto(), {
      totalCount: model.totalCount,
      bikes: model.items.map((item) => BikeResponseDto.fromModel(item)),
    });
  }
}
