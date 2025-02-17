import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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
    return this.musicGenderService.getMusicGenderById(id);
  }

  @Post()
  addMusicGender(@Body() description: string) {
    return this.musicGenderService.addMusicGender(description);
  }

  @Delete('/:id')
  deleteMusicGender(@Param('id') id: number) {
    return this.musicGenderService.deleteMusicGender(id);
  }
}
