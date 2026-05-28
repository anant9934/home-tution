import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @Min(1)
  order: number;
}

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  notesUrl?: string;

  @IsInt()
  @Min(1)
  duration: number; // in minutes

  @IsInt()
  @Min(1)
  order: number;
}
