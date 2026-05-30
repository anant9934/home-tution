import { IsOptional, IsString } from 'class-validator';

export class UpdateParentProfileDto {
  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
