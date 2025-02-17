import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { InstrumentsRepository } from './instruments.repo';
import { InstrumentsService } from './instruments.service';
import { InstrumentsController } from './instruments.controller';

@Module({
  imports: [PrismaModule],
  controllers: [InstrumentsController],
  providers: [InstrumentsService, InstrumentsRepository],
  exports: [InstrumentsService],
})
export class InstrumentsModule {}
