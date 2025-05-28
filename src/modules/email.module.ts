import { Module } from '@nestjs/common';
import { EmailController } from 'src/controllers/email.controller';
import { EmailService } from 'src/services/email.service';

@Module({
  imports: [],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
