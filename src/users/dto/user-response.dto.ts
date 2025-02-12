import { Exclude, Expose } from 'class-transformer';

export class UserResponseDTO {
  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: string;

  @Exclude()
  password: string;
}
