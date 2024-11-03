import { UserService } from '@app/modules/user/services/user.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
