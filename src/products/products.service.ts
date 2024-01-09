import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from '../errors';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    return await this.prismaService.product.create({ data: { ...createProductDto, quantity: 0 } })
  }

  async findAll() {
    return await this.prismaService.product.findMany()
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.product.findUniqueOrThrow({
        where: {
          id
        }
      })
    }
    catch (error) {
      // P2025 STATUS CODE DE ERRO DO NEST. OLHAR DOC DO NEST
      if (error.code === 'P2025') {
        throw new NotFoundError(`Product with ID ${id} not found`)
      }
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return await this.prismaService.product.update({
        where: {
          id
        },
        data: updateProductDto
      })
    }
    catch (error) {
      // P2025 STATUS CODE DE ERRO DO NEST. OLHAR DOC DO NEST
      if (error.code === 'P2025') {
        throw new NotFoundError(`Product with ID ${id} not found`)
      }
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.product.delete({ where: { id } })
    }
    catch (error) {
      // P2025 STATUS CODE DE ERRO DO NEST. OLHAR DOC DO NEST
      if (error.code === 'P2025') {
        throw new NotFoundError(`Product with ID ${id} not found`)
      }
    }
  }
}
