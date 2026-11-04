import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
} from "class-validator";

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

// Every column is required in the entity: a field may be omitted, never set to null.
const isSupplied = (_object: unknown, value: unknown) => value !== undefined;

export class UpdateBikeDto {
  @ValidateIf(isSupplied)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  brand?: string;

  @ValidateIf(isSupplied)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ValidateIf(isSupplied)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ValidateIf(isSupplied)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  category?: string;

  @ValidateIf(isSupplied)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  frameMaterial?: string;

  @ValidateIf(isSupplied)
  @IsPositive()
  frameSizeCm?: number;

  @ValidateIf(isSupplied)
  @IsPositive()
  wheelSizeInches?: number;

  @ValidateIf(isSupplied)
  @IsInt()
  @Min(1)
  gearCount?: number;

  @ValidateIf(isSupplied)
  @IsPositive()
  weightKg?: number;

  @ValidateIf(isSupplied)
  @IsBoolean()
  electric?: boolean;

  @ValidateIf(isSupplied)
  @IsInt()
  @Min(0)
  priceCents?: number;
}
