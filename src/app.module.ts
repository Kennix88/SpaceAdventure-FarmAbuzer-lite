import * as path from 'node:path'

import { PinoConfig } from '@app/core/configs/pino.config'
import { PrismaConfig } from '@app/core/configs/prisma.config'
import { GameModule } from '@app/modules/game/game.module'
import { TelegramModule } from '@app/modules/telegram/telegram.module'
import { UserModule } from '@app/modules/user/user.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n'
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
        disableMiddleware: true,
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, 'core/i18n/'),
          watch: true,
          includeSubfolders: true,
        },
        typesOutputPath: path.join(
          __dirname,
          '../src/shared/generated/i18n.generated.ts',
        ),
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      loader: I18nJsonLoader,
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
