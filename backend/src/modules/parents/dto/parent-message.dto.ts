import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  @IsNotEmpty()
  tutorUserId: string;

  @IsString()
  @IsNotEmpty()
  messageText: string;
}
