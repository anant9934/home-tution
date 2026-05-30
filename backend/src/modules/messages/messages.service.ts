import { Injectable, NotFoundException } from '@nestjs/common';
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
}
