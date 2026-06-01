import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tickets')
  createTicket(@Req() req: any, @Body() body: { title: string; description: string; priority?: string }) {
    return this.supportService.createTicket(req.user.userId, body.title, body.description, body.priority);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tickets')
  getUserTickets(@Req() req: any) {
    // If Admin, they should use /admin/support/tickets ideally, but we can return all if admin?
    // Let's keep this strict to the logged-in user's own tickets.
    return this.supportService.getUserTickets(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/tickets')
  getAllTickets(@Req() req: any) {
    // Should verify admin role ideally
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }
    return this.supportService.getAllTickets();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/tickets/:id/status')
  updateTicketStatus(@Req() req: any, @Param('id') id: string, @Body() body: { status: string }) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }
    return this.supportService.updateTicketStatus(id, body.status);
  }
}
