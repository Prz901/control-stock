import { Injectable } from '@nestjs/common';
import { CreateStockOutputDto } from './dto/create-stock-output.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'src/errors';

@Injectable()
export class StockOutputsService {
  constructor(private prismaService: PrismaService) { }


  async create(createStockOutPutDto: CreateStockOutputDto) {
    const product = await this.prismaService.product.findUnique({ where: { id: createStockOutPutDto.product_id } })

    if (!product) {
      throw new NotFoundError('Product not Found')
    }
    if (product.quantity === 0) {
      throw new Error('Product out of stock')
    }

    if (createStockOutPutDto.quantity > product.quantity) {
      throw new Error('Insufficient product quantity')
    }

    // lock row na tabela de produto
    const result = await this.prismaService.$transaction([
      this.prismaService.stockOutput.create({
        data:
        {
          productId: createStockOutPutDto.product_id,
          quantity: createStockOutPutDto.quantity,
          date: createStockOutPutDto.date
        }
      }),
      this.prismaService.product.update({
        where: {
          id: createStockOutPutDto.product_id
        },
        data: {
          quantity: {
            decrement: createStockOutPutDto.quantity
          }
        }
      })
    ])

    return result[0]
  }

  async findAll() {
    return await this.prismaService.stockOutput.findMany()
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.stockOutput.findUniqueOrThrow({
        where: {
          id
        }
      })
    }
    catch (error) {
      // P2025 STATUS CODE DE ERRO DO NEST. OLHAR DOC DO NEST
      if (error.code === 'P2025') {
        throw new NotFoundError(`Stock Output with ID ${id} not found`)
      }
    }
  }
}
