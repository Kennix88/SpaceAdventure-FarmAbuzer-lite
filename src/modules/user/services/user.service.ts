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

  async createUser(tgId: number | string, lang: string | undefined, _isGuard = false): Promise<User | null> {
    return this.prismaService.user.create({
      data: {
        telegramId: String(tgId),
        isGuard: _isGuard,
        language: lang,
      },
    })
  }
}
