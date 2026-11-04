import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
} from "class-validator";

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

// Mirrors the columns and CHECK constraints of BikeEntity.
export class CreateBikeDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  brand: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  model: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  category: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  frameMaterial: string;

  @IsPositive()
  frameSizeCm: number;

  @IsPositive()
  wheelSizeInches: number;

  @IsInt()
  @Min(1)
  gearCount: number;

  @IsPositive()
  weightKg: number;

  @IsBoolean()
  electric: boolean;

  @IsInt()
  @Min(0)
  priceCents: number;
}
