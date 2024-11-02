import { Context } from '@app/modules/telegram/interfaces/telegrafContext.interface'
import { PinoLogger } from 'nestjs-pino'
import { Ctx, Start, Update } from 'nestjs-telegraf'

@Update()
export class StartUpdate {
  constructor(
    // private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(StartUpdate.name)
  }

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    try {
      await ctx.setMyCommands([{ command: 'start', description: 'Main menu' }])

      if (ctx.chat?.type !== 'private') {
        return
      }

      await ctx.replyWithHTML(`Welcome to Farmabuzer Bot. Use /start to go to the main menu.`)
    } catch (e) {
      this.logger.error({ tgUserId: ctx.from?.id, msg: `An error occurred when starting the bot`, err: e })
    }
  }
}
