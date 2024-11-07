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
      await ctx
        .reply(
          this.i18n.t('telegraf.addProfile.step1', {
            ...(!ctx.from?.language_code
              ? {}
              : { lang: ctx.from.language_code }),
          }),
          {
            parse_mode: 'HTML',
            link_preview_options: {
              is_disabled: true,
            },
            reply_markup: {
              inline_keyboard: [
                [
                  Markup.button.callback(
                    `📍 ${this.i18n.t('telegraf.menu.main', {
                      ...(!ctx.from?.language_code
                        ? {}
                        : { lang: ctx.from.language_code }),
                    })}`,
                    'backMainMenu',
                  ),
                ],
              ],
            },
          },
        )
        .then((m) => {
          ctx.wizard.state['deleteMessageId'] = m.message_id
        })
      ctx.wizard.next()
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

  @Action('back')
  async back(
    @Ctx()
    ctx: WizardContext & { wizard: { state: { deleteMessageId: number } } },
  ) {
    try {
      await ctx.deleteMessage(ctx.wizard.state['deleteMessageId'])
      ctx.wizard.back()
    } catch (e) {
      this.logger.error({
        tgUserId: ctx.from?.id,
        msg: `Error when back`,
        err: e,
      })
    }
  }

  @On('text')
  @WizardStep(2)
  async onName(
    @Message('text') msg: string,
    @Ctx()
    ctx: WizardContext & { wizard: { state: { deleteMessageId: number } } },
  ) {
    try {
      await ctx.deleteMessage(ctx.wizard.state['deleteMessageId'])
      await ctx.deleteMessage()
      ctx.wizard.state['name'] = msg
      await ctx
        .reply(
          this.i18n.t('telegraf.addProfile.step2', {
            ...(!ctx.from?.language_code
              ? {}
              : { lang: ctx.from.language_code }),
            args: { name: msg },
          }),
          {
            parse_mode: 'HTML',
            link_preview_options: {
              is_disabled: true,
            },
            reply_markup: {
              inline_keyboard: [
                [
                  Markup.button.callback(
                    `📍 ${this.i18n.t('telegraf.menu.main', {
                      ...(!ctx.from?.language_code
                        ? {}
                        : { lang: ctx.from.language_code }),
                    })}`,
                    'backMainMenu',
                  ),
                ],
              ],
            },
          },
        )
        .then((m) => {
          ctx.wizard.state['deleteMessageId'] = m.message_id
        })
      ctx.wizard.next()
    } catch (e) {
      this.logger.error({
        tgUserId: ctx.from?.id,
        msg: `When entering the addProfile scene step2`,
        err: e,
      })
      await ctx.scene.leave()
    }
  }

  @On('text')
  @WizardStep(3)
  async onInitData(
    @Message('text') msg: string,
    @Ctx()
    ctx: WizardContext & {
      wizard: { state: { deleteMessageId: number; name: string } }
    },
  ) {
    try {
      await ctx.deleteMessage(ctx.wizard.state['deleteMessageId'])
      await ctx.deleteMessage()
      ctx.wizard.state['initData'] = msg
      await ctx
        .reply(
          this.i18n.t('telegraf.addProfile.step3', {
            ...(!ctx.from?.language_code
              ? {}
              : { lang: ctx.from.language_code }),
            args: { name: ctx.wizard.state['name'], initData: msg },
          }),
          {
            parse_mode: 'HTML',
            link_preview_options: {
              is_disabled: true,
            },
            reply_markup: {
              inline_keyboard: [
                [
                  Markup.button.callback(
                    `❌ ${this.i18n.t('telegraf.menu.notProxy', {
                      ...(!ctx.from?.language_code
                        ? {}
                        : { lang: ctx.from.language_code }),
                    })}`,
                    'notProxy',
                  ),
                ],
                [
                  Markup.button.callback(
                    `📍 ${this.i18n.t('telegraf.menu.main', {
                      ...(!ctx.from?.language_code
                        ? {}
                        : { lang: ctx.from.language_code }),
                    })}`,
                    'backMainMenu',
                  ),
                ],
              ],
            },
          },
        )
        .then((m) => {
          ctx.wizard.state['deleteMessageId'] = m.message_id
        })
      ctx.wizard.next()
    } catch (e) {
      this.logger.error({
        tgUserId: ctx.from?.id,
        msg: `When entering the addProfile scene step3`,
        err: e,
      })
      await ctx.scene.leave()
    }
  }
}
