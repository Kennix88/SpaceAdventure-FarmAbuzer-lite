import { TelegrafConfig } from '@app/modules/telegram/configs/telegraf.config'
import { StartUpdate } from '@app/modules/telegram/start.update'
import { Module } from '@nestjs/common'
import { TelegrafModule } from 'nestjs-telegraf'

@Module({
  imports: [TelegrafModule.forRootAsync(TelegrafConfig())],
  providers: [StartUpdate],
})
export class TelegramModule {}
