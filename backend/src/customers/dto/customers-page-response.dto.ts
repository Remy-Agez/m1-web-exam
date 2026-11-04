import type { PageModel } from "../../shared/models/pagination.model";
import type { CustomerModel } from "../models/customer.model";
import { CustomerResponseDto } from "./customer-response.dto";

export class CustomersPageResponseDto {
  totalCount: number;
  customers: CustomerResponseDto[];

  static fromModel(model: PageModel<CustomerModel>): CustomersPageResponseDto {
    return Object.assign(new CustomersPageResponseDto(), {
      totalCount: model.totalCount,
      customers: model.items.map((item) => CustomerResponseDto.fromModel(item)),
    });
  }
}
