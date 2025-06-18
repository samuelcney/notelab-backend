import { Body, Controller, Post } from '@nestjs/common';
import { RecoverPasswordDTO } from 'src/common/classes/dtos/recover-password.dto';
import { PasswordRequestService } from 'src/services/password-request.service';

@Controller('/recovery-password')
export class PasswordRequestController {
  constructor(
    private readonly passwordRequestService: PasswordRequestService,
  ) {}

  @Post('/email')
  sendRecoveryEmail(@Body() body: { email: string }) {
    return this.passwordRequestService.recoverPasswordRequest(body.email);
  }

  @Post('/validate-token')
  validateToken(@Body() data: Omit<RecoverPasswordDTO, 'newPassword'>) {
    return this.passwordRequestService.validateToken(data);
  }

  @Post('/reset')
  resetPassword(@Body() data: Omit<RecoverPasswordDTO, 'token'>) {
    return this.passwordRequestService.resetPassword(data);
  }
}
