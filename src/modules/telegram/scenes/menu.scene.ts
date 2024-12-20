import { ProfilesService } from '@app/modules/game/services/profiles.service'
import { Context } from '@app/modules/telegram/interfaces/telegrafContext.interface'
import { StartUpdate } from '@app/modules/telegram/start.update'
import { UserService } from '@app/modules/user/services/user.service'
import { I18nTranslations } from '@app/shared/generated/i18n.generated'
import { ConfigService } from '@nestjs/config'
import { I18nService } from 'nestjs-i18n'
import { PinoLogger } from 'nestjs-pino'
import { Action, Command, Ctx, Scene, SceneEnter, Start } from 'nestjs-telegraf'
import { Markup } from 'telegraf'

@Scene('menu')
export class MenuScene {
  constructor(
    private readonly configService: ConfigService,
    private readonly startUpdate: StartUpdate,
    private readonly userService: UserService,
    private readonly profilesService: ProfilesService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly logger: PinoLogger,
  ) {}

  @Start()
  @Command('start')
  async startCommand(@Ctx() ctx: Context) {
    await ctx.scene.leave()
    await this.startUpdate.startCommand(ctx)
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    try {
      const getUser = await this.userService.getUser(ctx.from!.id)
      const getProfiles = await this.profilesService.getProfiles(getUser!.id)

      const isAdmin =
        ctx.from?.id === this.configService.get('ADMIN_TELEGRAM_ID')

      await ctx
        .replyWithHTML(
          `📍 <b>${this.i18n.t('telegraf.menu.main', {
            ...(!getUser?.language ? {} : { lang: getUser.language }),
          })}:</b>`,
          Markup.inlineKeyboard([
            [
              Markup.button.callback(
                `➕ ${this.i18n.t('telegraf.menu.addProfile', {
                  ...(!getUser?.language ? {} : { lang: getUser.language }),
                })}`,
                'addProfile',
              ),
            ],
            [
              Markup.button.callback(
                `👤 ${this.i18n.t('telegraf.menu.profiles', {
                  ...(!getUser?.language ? {} : { lang: getUser.language }),
                })}`,
                'profiles',
                !!getProfiles,
              ),
            ],
            [
              Markup.button.callback(
                `➖⬇️➖ ${this.i18n.t('telegraf.menu.admin', {
                  ...(!getUser?.language ? {} : { lang: getUser.language }),
                })} ➖⬇️➖`,
                'NO',
                isAdmin,
              ),
            ],
            [
              Markup.button.callback(
                `👥 ${this.i18n.t('telegraf.menu.giveAccess', {
                  ...(!getUser?.language ? {} : { lang: getUser.language }),
                })}`,
                'giveAccess',
                isAdmin,
              ),
            ],
            [
              Markup.button.callback(
                `💾 ${this.i18n.t('telegraf.menu.logs', {
                  ...(!getUser?.language ? {} : { lang: getUser.language }),
                })}`,
                'logs',
                isAdmin,
              ),
            ],
          ]),
        )
        .catch((e) => {
          this.logger.error({
            tgUserId: ctx.from?.id,
            msg: `Error when sending a message from the menu in Telegram`,
            err: e,
          })
        })
    } catch (e) {
      this.logger.error({
        tgUserId: ctx.from?.id,
        msg: `When entering the menu scene`,
        err: e,
      })
      await ctx.scene.leave()
      await this.startUpdate.startCommand(ctx)
    }
  }

  @Action('addProfile')
  async addProfile(@Ctx() ctx: Context) {
    try {
      await ctx.deleteMessage(ctx.callbackQuery?.message?.message_id)
      await ctx.scene.enter('addProfile')
    } catch (e) {
      this.logger.error({
        tgUserId: ctx.from?.id,
        msg: `Error when alling the scene addProfile`,
        err: e,
      })
    }
  }

  // @SceneLeave()
  // async onSceneLeave(@Ctx() ctx: Context) {
  //   try {
  //     // asd
  //   } catch (e) {
  //     this.logger.error({
  //       tgUserId: ctx.from?.id,
  //       msg: `Error when exiting the scene menu`,
  //       err: e,
  //     })
  //   }
  // }
}
