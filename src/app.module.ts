import { PrismaConfig } from '@app/core/configs/prisma.config'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'nestjs-prisma'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      cache: true,
    }),
    PrismaModule.forRootAsync(PrismaConfig()),
  ],
  providers: [],
})
export class AppModule {}
