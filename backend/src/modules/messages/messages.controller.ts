import { Controller, Get, Post, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  getConversations(@Request() req: any) {
    return this.messagesService.getConversations(req.user.userId);
  }

  @Post('conversations')
  createOrGetConversation(@Request() req: any, @Body() body: { targetUserId: string }) {
    return this.messagesService.createOrGetConversation(req.user.userId, body.targetUserId);
  }

  @Get('conversations/:id')
  getMessages(@Request() req: any, @Param('id') id: string) {
    return this.messagesService.getMessages(req.user.userId, id);
  }

  @Post('conversations/:id')
  sendMessage(@Request() req: any, @Param('id') id: string, @Body() body: { messageText: string }) {
    return this.messagesService.sendMessage(req.user.userId, id, body.messageText);
  }

  @Post('broadcast')
  broadcastMessage(@Request() req: any, @Body() body: { targetGroup: 'ALL' | 'STUDENTS' | 'TUTORS', messageText: string }) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException("Only admins can broadcast messages");
    }
    return this.messagesService.broadcastMessage(req.user.userId, body.targetGroup, body.messageText);
  }
}
