import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { StockInputsModule } from './stock-inputs/stock-inputs.module';
import { StockOutputsModule } from './stock-outputs/stock-outputs.module';
@Module({
  imports: [ProductsModule, StockInputsModule, StockOutputsModule],
  controllers: [AppController],
})
export class AppModule { }
