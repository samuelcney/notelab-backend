import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/auth.controller';
import { UsersModule } from 'src/modules/users.module';
import { AuthService } from 'src/services/auth.service';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
