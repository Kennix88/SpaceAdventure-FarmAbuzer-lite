import { Injectable } from '@nestjs/common'
import { Profiles } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class ProfilesService {
  constructor(private prismaService: PrismaService) {}

  async getProfiles(userId: number): Promise<Profiles[] | null> {
    return this.prismaService.profiles.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        startData: true,
        gameData: true,
      },
    })
  }

  async getProfile(id: number): Promise<Profiles | null> {
    return this.prismaService.profiles.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        startData: true,
        gameData: true,
      },
    })
  }

  // async createProfile(
  //   tgId: number | string,
  //   language: string | undefined,
  //   _isGuard = false,
  // ): Promise<Profiles | null> {
  //   return this.prismaService.user.create({
  //     data: {
  //       telegramId: String(tgId),
  //       isGuard: _isGuard,
  //       language,
  //     },
  //   })
  // }

  // async updateProfile(
  //   id: number,
  // ): Promise<Profiles | null> {
  //   return this.prismaService.user.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //
  //     },
  //   })
  // }
}
