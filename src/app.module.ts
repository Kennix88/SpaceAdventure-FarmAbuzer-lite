import { PinoConfig } from '@app/core/configs/pino.config'
import { PrismaConfig } from '@app/core/configs/prisma.config'
import { TelegramModule } from '@app/modules/telegram/telegram.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { PrismaModule } from 'nestjs-prisma'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      cache: true,
    }),
    LoggerModule.forRootAsync(PinoConfig()),
    PrismaModule.forRootAsync(PrismaConfig()),
    TelegramModule,
  ],
  providers: [],
})
export class AppModule {}
