import { Scenes } from 'telegraf'

export interface Context extends Scenes.SceneContext {
  session: Scenes.SceneSession & {
    // addProfile?: {
    //   step?: 1 | 2 | 3
    //   name?: string
    //   initData?: string
    //   proxy?: string
    // }
  }
}

export interface WizardContext extends Scenes.WizardContext {
  session: Scenes.WizardSession & {
    a: string
  }
}
