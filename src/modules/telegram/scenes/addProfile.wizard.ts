import {
  Context,
  WizardContext,
} from '@app/modules/telegram/interfaces/telegrafContext.interface'
import { StartUpdate } from '@app/modules/telegram/start.update'
import { I18nTranslations } from '@app/shared/generated/i18n.generated'
import { I18nService } from 'nestjs-i18n'
import { PinoLogger } from 'nestjs-pino'
import {
  Action,
  Command,
  Ctx,
  Message,
  On,
  SceneLeave,
  Start,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf'
import { Markup } from 'telegraf'

@Wizard('addProfile')
export class AddProfileWizard {
  constructor(
    private readonly startUpdate: StartUpdate,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly logger: PinoLogger,
  ) {}

  @Start()
  @Command('start')
  async startCommand(@Ctx() ctx: Context) {
    await ctx.scene.leave()
    await this.startUpdate.startCommand(ctx)
  }

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext) {
    try {
      ctx.wizard.next()
      await ctx.replyWithHTML(
        this.i18n.t('telegraf.addProfile.step1', {
          ...(!ctx.from?.language_code ? {} : { lang: ctx.from.language_code }),
        }),
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              `↩ ${this.i18n.t('telegraf.menu.main', {
                ...(!ctx.from?.language_code
                  ? {}
                  : { lang: ctx.from.language_code }),
              })}`,
              'backMainMenu',
            ),
          ],
        ]),
      )
    } catch (e) {
      this.logger.error({
        tgUserId: ctx.from?.id,
        msg: `When entering the addProfile scene`,
        err: e,
      })
      await ctx.scene.leave()
    }
  }

  @Action('backMainMenu')
  async backMainMenu(@Ctx() ctx: Context) {
    try {
      await ctx.deleteMessage(ctx.callbackQuery?.message?.message_id)
      await ctx.scene.enter('menu')
    } catch (e) {
      this.logger.error({
        tgUserId: ctx.from?.id,
        msg: `Error when alling the scene menu`,
        err: e,
      })
    }
  }

  @On('text')
  @WizardStep(2)
  async onName(@Message('text') msg: string, @Ctx() ctx: WizardContext) {
    try {
      ctx.wizard.state['name'] = msg
    } catch (e) {
      this.logger.error({
        tgUserId: ctx.from?.id,
        msg: `When entering the addProfile scene step2`,
        err: e,
      })
      await ctx.scene.leave()
    }
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context) {
    try {
      // ctx.session.addProfile = undefined
    } catch (e) {
      this.logger.error({
        tgUserId: ctx.from?.id,
        msg: `Error when exiting the scene addProfile`,
        err: e,
      })
    }
  }
}
