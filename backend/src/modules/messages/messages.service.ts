import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId }
        }
      },
      include: {
        participants: {
          select: { id: true, name: true, role: true, avatarUrl: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return conversations.map(c => {
      const otherParticipant = c.participants.find(p => p.id !== userId) || c.participants[0];
      return {
        id: c.id,
        participant: otherParticipant,
        latestMessage: c.messages[0] || null,
        updatedAt: c.messages[0]?.createdAt || c.createdAt
      };
    }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async createOrGetConversation(userId: string, targetUserId: string) {
    if (userId === targetUserId) throw new ForbiddenException("Cannot message yourself");

    const sender = await this.prisma.user.findUnique({ where: { id: userId }});
    const target = await this.prisma.user.findUnique({ where: { id: targetUserId }});

    if (!sender || !target) throw new NotFoundException("User not found");

    // --- Strict RBAC Logic ---
    const isSenderAdmin = sender.role === 'ADMIN' || sender.role === 'SUPER_ADMIN';
    const isTargetAdmin = target.role === 'ADMIN' || target.role === 'SUPER_ADMIN';

    // Admins can message anyone, and anyone can message admins
    if (!isSenderAdmin && !isTargetAdmin) {
      if (sender.role === 'STUDENT' && target.role === 'STUDENT') {
        throw new ForbiddenException("Students cannot message other students directly.");
      }
      if (sender.role === 'TUTOR' && target.role === 'TUTOR') {
        throw new ForbiddenException("Tutors cannot message other tutors directly.");
      }
      if (sender.role === 'PARENT' && target.role === 'PARENT') {
        throw new ForbiddenException("Parents cannot message other parents directly.");
      }

      // Check tutor/student assignment rules
      if ((sender.role === 'TUTOR' && target.role === 'STUDENT') || (sender.role === 'STUDENT' && target.role === 'TUTOR')) {
        const studentId = sender.role === 'STUDENT' ? userId : targetUserId;
        const tutorId = sender.role === 'TUTOR' ? userId : targetUserId;
        
        // Ensure this tutor is assigned to this student (via booking or assignedTutorId)
        const studentProfile = await this.prisma.studentProfile.findUnique({ where: { userId: studentId }});
        const tutorProfile = await this.prisma.tutorProfile.findUnique({ where: { userId: tutorId }});
        
        if (!studentProfile || !tutorProfile) throw new NotFoundException("Profile not found");

        const hasBooking = await this.prisma.booking.findFirst({
          where: { studentId: studentProfile.id, tutorId: tutorProfile.id }
        });

        if (!hasBooking && studentProfile.assignedTutorId !== tutorProfile.id) {
           throw new ForbiddenException("You can only message assigned tutors/students.");
        }
      }
      
      // Tutor and Parent rules
      if ((sender.role === 'TUTOR' && target.role === 'PARENT') || (sender.role === 'PARENT' && target.role === 'TUTOR')) {
        const parentId = sender.role === 'PARENT' ? userId : targetUserId;
        const tutorId = sender.role === 'TUTOR' ? userId : targetUserId;
        
        const parentProfile = await this.prisma.parentProfile.findUnique({ where: { userId: parentId }, include: { children: true }});
        const tutorProfile = await this.prisma.tutorProfile.findUnique({ where: { userId: tutorId }});
        
        if (!parentProfile || !tutorProfile) throw new NotFoundException("Profile not found");

        // Parent must have a child assigned to this tutor
        let isValid = false;
        for (const child of parentProfile.children) {
           if (child.assignedTutorId === tutorProfile.id) isValid = true;
           const hasBooking = await this.prisma.booking.findFirst({ where: { studentId: child.id, tutorId: tutorProfile.id }});
           if (hasBooking) isValid = true;
        }

        if (!isValid) {
          throw new ForbiddenException("You can only message parents/tutors of assigned students.");
        }
      }
    }

    // Check if a DIRECT conversation between these two already exists
    const existing = await this.prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          { participants: { some: { id: userId } } },
          { participants: { some: { id: targetUserId } } }
        ]
      },
      include: {
        participants: {
          select: { id: true, name: true, role: true, avatarUrl: true }
        }
      }
    });

    if (existing) return existing;

    // Create a new one
    return this.prisma.conversation.create({
      data: {
        type: 'DIRECT',
        participants: {
          connect: [{ id: userId }, { id: targetUserId }]
        }
      },
      include: {
        participants: {
          select: { id: true, name: true, role: true, avatarUrl: true }
        }
      }
    });
  }

  async getMessages(userId: string, conversationId: string) {
    // Ensure the user is part of the conversation
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { some: { id: userId } }
      }
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    });
  }

  async sendMessage(userId: string, conversationId: string, messageText: string) {
    // Ensure the user is part of the conversation
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { some: { id: userId } }
      }
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    return this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        messageText
      },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    });
  }

  async broadcastMessage(adminId: string, targetGroup: 'ALL' | 'STUDENTS' | 'TUTORS', messageText: string) {
    // Find all users in target group
    const whereClause = targetGroup === 'ALL' ? 
      { role: { in: ['STUDENT', 'TUTOR', 'PARENT'] } } : 
      targetGroup === 'STUDENTS' ? { role: 'STUDENT' } : { role: 'TUTOR' };
      
    // @ts-ignore
    const targetUsers = await this.prisma.user.findMany({ where: whereClause });

    for (const user of targetUsers) {
      // Get or create conversation between admin and user
      let conversation = await this.prisma.conversation.findFirst({
        where: {
          type: 'DIRECT',
          AND: [
            { participants: { some: { id: adminId } } },
            { participants: { some: { id: user.id } } }
          ]
        }
      });

      if (!conversation) {
        conversation = await this.prisma.conversation.create({
          data: {
            type: 'DIRECT',
            participants: { connect: [{ id: adminId }, { id: user.id }] }
          }
        });
      }

      await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: adminId,
          messageText
        }
      });
    }

    return { success: true, count: targetUsers.length };
  }
}
