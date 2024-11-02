import { ConfigService } from '@nestjs/config'
import { SQLite } from '@telegraf/session/sqlite'
import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf'
import { session } from 'telegraf'

export const TelegrafConfig = (): TelegrafModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    token: configService.get<string>('TELEGRAM_BOT_TOKEN') || '',
    middlewares: [
      session({
        store: SQLite({
          filename: './database/telegraf-sessions.sqlite',
        }),
      }),
    ],
  }),
  inject: [ConfigService],
})
