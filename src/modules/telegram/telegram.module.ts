import { TelegrafConfig } from '@app/modules/telegram/configs/telegraf.config'
import { MenuScene } from '@app/modules/telegram/scenes/menu.scene'
import { StartUpdate } from '@app/modules/telegram/start.update'
import { UserModule } from '@app/modules/user/user.module'
import { Module } from '@nestjs/common'
import { TelegrafModule } from 'nestjs-telegraf'

@Module({
  imports: [TelegrafModule.forRootAsync(TelegrafConfig()), UserModule],
  providers: [StartUpdate, MenuScene],
})
export class TelegramModule {}
