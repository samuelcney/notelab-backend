import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MusicGenderService } from './musicGender.service';
import { MusicGenderRepository } from './musicGender.repo';
import { MusicGenderController } from './musicGender.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MusicGenderController],
  providers: [MusicGenderService, MusicGenderRepository],
  exports: [MusicGenderService],
})
export class MusicGenderModule {}
