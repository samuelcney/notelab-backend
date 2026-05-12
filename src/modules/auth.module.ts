import { Module } from '@nestjs/common';
import { AuthController } from '@/controllers/auth.controller';
import { UsersModule } from '@/modules/users.module';
import { AuthService } from '@/services/auth.service';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
