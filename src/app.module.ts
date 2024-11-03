import * as path from 'node:path'

import { PinoConfig } from '@app/core/configs/pino.config'
import { PrismaConfig } from '@app/core/configs/prisma.config'
import { GameModule } from '@app/modules/game/game.module'
import { TelegramModule } from '@app/modules/telegram/telegram.module'
import { UserModule } from '@app/modules/user/user.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import { LoggerModule } from 'nestjs-pino'
import { PrismaModule } from 'nestjs-prisma'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      cache: true,
    }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, 'core/i18n/'),
          watch: true,
        },
      }),
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver, new HeaderResolver(['x-lang'])],
    }),
    LoggerModule.forRootAsync(PinoConfig()),
    PrismaModule.forRootAsync(PrismaConfig()),
    TelegramModule,
    UserModule,
    GameModule,
  ],
  providers: [],
})
export class AppModule {}
