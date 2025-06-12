import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';

import { ZodValidationPipe } from 'nestjs-zod';
import { CreateUserDTO } from 'src/common/classes/schemas/create-user.dto';
import { UpdateUserDTO } from 'src/common/classes/schemas/update-profile-info.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersService } from 'src/services/users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/info/me')
  async getMe(@Req() req): Promise<any> {
    const supabaseUser = req.user;
    const dbUser = await this.usersService.getUserById(supabaseUser.id);

    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      role: supabaseUser.app_metadata?.role,
      name: dbUser?.name,
      createdAt: dbUser?.createdAt,
      updatedAt: dbUser?.updatedAt,
      userBio: {
        bio: dbUser?.userBio?.bio,
        avatarUrl: dbUser?.userBio?.avatarUrl,
        phone: dbUser?.userBio?.phone,
      },
    };
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('/email')
  getUserByEmail(@Query('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Put('/update-user')
  @UsePipes(ZodValidationPipe)
  updateUser(@Body() data: Partial<CreateUserDTO>) {
    return this.usersService.updateUser(data);
  }

  @Put('/update-profile/:userId')
  @UseInterceptors(FileInterceptor('avatar'))
  updateProfile(
    @Body() data: Partial<UpdateUserDTO>,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return this.usersService.updateUserProfile(userId, data, file);
    } catch (error: any) {
      Logger.error(
        `Error updating profile for user ${userId}: ${error.message}`,
      );
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }

  @Put('/update-role')
  updateUserRole(@Body() data: { id: string; newRole: Role }) {
    return this.usersService.updateRole(data.id, data.newRole);
  }

  @Post('/update/status/:id')
  updateUserStatus(
    @Param('id') userId: string,
    @Body() body: { status: boolean },
  ) {
    Logger.log(
      `Updating status for user ${JSON.stringify(userId)} to ${JSON.stringify(body.status)}`,
    );
    return this.usersService.updateUserStatus(userId, body.status);
  }

  @Delete()
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
