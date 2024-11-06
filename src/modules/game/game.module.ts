import { ProfilesService } from '@app/modules/game/services/profiles.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class GameModule {}
