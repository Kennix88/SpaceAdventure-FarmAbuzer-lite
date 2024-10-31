import { ConfigService } from '@nestjs/config'
import { PrismaModuleAsyncOptions } from 'nestjs-prisma'

export const PrismaConfig = (): PrismaModuleAsyncOptions => ({
  isGlobal: true,
  useFactory: (config: ConfigService) => ({
    prismaOptions: {
      log: ['warn', 'error'],
      datasources: {
        db: {
          provider: 'sqlite',
          url: config.getOrThrow<string>('DATABASE_PATH') || 'file:database/namedb.db',
        },
      },
    },
  }),
  inject: [ConfigService],
})
