import { IsDateString, IsInt, IsNotEmpty, IsPositive } from "class-validator";
import { Type } from 'class-transformer'

export class CreateStockInputDto {
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  // @IsDateString() //iso 8601
  @IsNotEmpty()
  @Type(() => Date)
  date: string;
}