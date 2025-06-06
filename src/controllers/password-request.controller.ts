import { Body, Controller, Post } from '@nestjs/common';
import { RecoverPasswordDTO } from 'src/common/classes/dtos/recover-password.dto';
import { PasswordRequestService } from 'src/services/password-request.service';

@Controller('recovery-password')
export class PasswordRequestController {
  constructor(
    private readonly passwordRequestService: PasswordRequestService,
  ) {}

  @Post('email')
  async sendRecoveryEmail(@Body() email: string) {
    return await this.passwordRequestService.recoverPasswordRequest(email);
  }

  @Post('validate-token')
  async validateToken(@Body() data: Omit<RecoverPasswordDTO, 'newPassword'>) {
    return await this.passwordRequestService.validateToken(data);
  }

  @Post('reset')
  async resetPassword(@Body() data: Omit<RecoverPasswordDTO, 'token'>) {
    return await this.passwordRequestService.resetPassword(data);
  }
}
