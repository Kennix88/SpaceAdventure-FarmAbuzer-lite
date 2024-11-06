import { Context } from '@app/modules/telegram/interfaces/telegrafContext.interface'
import { UserService } from '@app/modules/user/services/user.service'
import { I18nTranslations } from '@app/shared/generated/i18n.generated'
import { ConfigService } from '@nestjs/config'
import { I18nService } from 'nestjs-i18n'
import { PinoLogger } from 'nestjs-pino'
import { Ctx, Help, Start, Update } from 'nestjs-telegraf'

@Update()
export class StartUpdate {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly logger: PinoLogger,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {
    this.logger.setContext(StartUpdate.name)
  }

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    try {
      await ctx.setMyCommands([
        {
          command: 'start',
          description: this.i18n.t('telegraf.commands.menu', {
            ...(!ctx.from?.language_code
              ? {}
              : { lang: ctx.from.language_code }),
          }),
        },
      ])

      if (ctx.chat?.type !== 'private') {
        return
      }
      if (!ctx.from) {
        return
      }

      let getUser = await this.userService.getUser(ctx.from.id)
      this.logger.info(
        { tgUserId: ctx.from.id, user: getUser },
        `We have received the user's data`,
      )
      if (!getUser) {
        getUser = await this.userService.createUser(
          ctx.from.id,
          ctx.from.language_code ? ctx.from.language_code : 'en',
          ctx.from.id === this.configService.get<number>('ADMIN_TELEGRAM_ID'),
        )
        this.logger.info(
          { tgUserId: ctx.from.id, user: getUser },
          `The user is registered`,
        )
      }
      if (getUser && getUser.language !== ctx.from.language_code) {
        getUser = await this.userService.updateUser(
          getUser.id,
          getUser.isGuard,
          ctx.from.language_code ? ctx.from.language_code : 'en',
        )
      }

      if (!getUser?.isGuard) {
        await ctx
          .replyWithHTML(
            this.i18n.t('telegraf.start.access', {
              ...(!ctx.from.language_code
                ? {}
                : { lang: ctx.from.language_code }),
              args: { id: ctx.from.id },
            }),
          )
          .catch((e) => {
            this.logger.error({
              tgUserId: ctx.from?.id,
              msg: `Error sending a message to Telegram`,
              err: e,
            })
          })
        this.logger.info(
          { tgUserId: ctx.from.id, user: getUser },
          `Access is denied to the user!`,
        )
        return
      }

      await ctx.scene.enter('menu')
    } catch (e) {
      this.logger.error({
        tgUserId: ctx.from?.id,
        msg: `An error occurred when starting the bot`,
        err: e,
      })
    }
  }

  @Help()
  async commandHelp(@Ctx() ctx: Context) {
    try {
      await ctx
        .replyWithHTML(
          this.i18n.t('telegraf.help', {
            ...(!ctx.from?.language_code
              ? {}
              : { lang: ctx.from.language_code }),
            args: { id: ctx.from?.id },
          }),
        )
        .catch((e) => {
          this.logger.error({
            tgUserId: ctx.from?.id,
            msg: `Error sending a message to Telegram`,
            err: e,
          })
        })
    } catch (e) {
      this.logger.error({
        tgUserId: ctx.from?.id,
        msg: `Error when calling the /help command`,
        err: e,
      })
    }
  }
}
