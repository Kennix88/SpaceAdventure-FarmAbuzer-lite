import { Scenes } from 'telegraf'

export interface Context extends Scenes.SceneContext {
  session: Scenes.SceneSession & {
    a: string
  }
}
