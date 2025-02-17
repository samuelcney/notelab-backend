import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MusicGenderService } from './musicGender.service';

@Controller('musicGender')
export class MusicGenderController {
  constructor(private readonly musicGenderService: MusicGenderService) {}

  @Get()
  getAllMusicGenders() {
    return this.musicGenderService.getAllMusicGenders();
  }

  @Get('/:id')
  getMusicGenderById(@Param('id') id: number) {
    return this.musicGenderService.getMusicGenderById(Number(id));
  }

  @Post()
  addMusicGender(@Body() data: MusicGenderType) {
    return this.musicGenderService.addMusicGender(data);
  }

  @Put('/:id')
  updateInstrument(@Body() data: MusicGenderType, @Param('id') id: number) {
    return this.musicGenderService.updateMusicGender(data, Number(id));
  }

  @Delete('/:id')
  deleteMusicGender(@Param('id') id: number) {
    return this.musicGenderService.deleteMusicGender(Number(id));
  }
}
