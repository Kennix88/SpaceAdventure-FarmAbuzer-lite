import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUser(tgId: number | string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        telegramId: String(tgId),
      },
    })
  }

  async createUser(
    tgId: number | string,
    language: string | undefined,
    _isGuard = false,
  ): Promise<User | null> {
    return this.prismaService.user.create({
      data: {
        telegramId: String(tgId),
        isGuard: _isGuard,
        language,
      },
    })
  }

  async updateUser(
    id: number,
    isGuard: boolean,
    language: string | undefined,
  ): Promise<User | null> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        isGuard,
        language,
      },
    })
  }
}
