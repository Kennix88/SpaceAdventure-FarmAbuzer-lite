import { PinoConfig } from '@app/core/configs/pino.config'
import { PrismaConfig } from '@app/core/configs/prisma.config'
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
  ],
  providers: [],
})
export class AppModule {}
