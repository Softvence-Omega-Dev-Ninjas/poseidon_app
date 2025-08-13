// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { RedisService } from './message.services';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { PayloadType } from 'src/auth/guard/jwtPayloadType';
import { Role } from 'src/auth/guard/role.enum';
import { JwtService } from '@nestjs/jwt';
import { IsString, IsUUID } from 'class-validator';

import { GetConversationsDto, SendMessageDto } from './message.dto';
@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    let token =
      client.handshake.auth?.token || client.handshake.headers?.authorization;
    if (!token) {
      client.emit('error', { message: 'Authentication token is required' });
      client.disconnect();
      return;
    }
    if (!process.env.AUTHSECRET) {
      throw new Error('AUTHSECRET is not defined');
    }
    if (token.startsWith('Bearer ')) {
      token = token.replace('Bearer ', '');
    }
    try {
      // const decoded = jwt.verify(token, process.env.AUTHSECRET) as PayloadType;
      // const userId = decoded.id;
      const decoded = await this.jwtService.verifyAsync<PayloadType>(token, {
        secret: process.env.AUTHSECRET,
      });
      const userId = decoded.id;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        client.emit('error', { message: 'User not found.' });
        client.disconnect();
        return;
      }

      await this.redisService.hSet('userSocketMap', userId, client.id);

      //
      this.server.emit('isUserActiveResponse', {
        userId,
        active: true,
      });

      client.emit('connectionSuccess', {
        message: 'User connected and authenticated successfully.',
        userId,
        socketId: client.id,
      });
    } catch (error) {
      console.error('Authentication error:', error);
      client.emit('error', { message: 'Invalid or expired token' });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userSocketMap = await this.redisService.hGetAll('userSocketMap');
    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === client.id,
    );

    if (userId) {
      await this.redisService.hDel('userSocketMap', userId);
      await this.redisService.hDel('userActiveChatMap', userId);
      this.server.emit('isUserActiveResponse', {
        userId,
        active: false,
      });
    }
  }

  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleSendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { sender, receiver, text } = data;
    const [user1Id, user2Id] = [sender, receiver].sort();

    let conversation = await this.prisma.conversation.findFirst({
      where: { user1Id, user2Id },
    });

    const receiverActiveWith = await this.redisService.hGet(
      'userActiveChatMap',
      receiver,
    );

    console.log(receiverActiveWith, 'receiverActiveWith');

    let savedMessage;

    // If no conversation, create it and send newConversation events
    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { user1Id, user2Id },
      });

      // Create first message immediately
      savedMessage = await this.prisma.message.create({
        data: {
          text,
          senderId: sender,
          receiverId: receiver,
          conversationId: conversation.id,
          isRead: receiverActiveWith === sender,
        },
      });

      // Update last message time
      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });

      const [senderUser, receiverUser] = await Promise.all([
        this.prisma.user.findUnique({
          where: { id: sender },
          include: { profile: true },
        }),
        this.prisma.user.findUnique({
          where: { id: receiver },
          include: { profile: true },
        }),
      ]);

      const newChatUserForReceiver = {
        id: senderUser?.id,
        unreadCount: 1,
        lastMessage: savedMessage,
        profile: senderUser?.profile?.image,
        name: senderUser?.profile?.name,
        role: senderUser?.role,
        conversationId: conversation.id,
      };

      const newChatUserForSender = {
        id: receiverUser?.id,
        unreadCount: 0,
        lastMessage: savedMessage,
        profile: receiverUser?.profile?.image,
        role: receiverUser?.role,
        name: receiverUser?.profile?.name,
        conversationId: conversation.id,
      };

      const [receiverSocketId, senderSocketId] = await Promise.all([
        this.redisService.hGet('userSocketMap', receiver),
        this.redisService.hGet('userSocketMap', sender),
      ]);

      if (receiverSocketId) {
        this.server
          .to(receiverSocketId)
          .emit('newConversation', newChatUserForReceiver);
      }

      if (senderSocketId) {
        this.server
          .to(senderSocketId)
          .emit('newConversation', newChatUserForSender);
      }
    } else {
      // If conversation exists, create message normally

      savedMessage = await this.prisma.message.create({
        data: {
          text,
          senderId: sender,
          receiverId: receiver,
          conversationId: conversation.id,
          isRead: receiverActiveWith === receiver,
        },
      });

      // Update last message time
      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });
    }

    // Emit message to receiver
    const receiverSocketId = await this.redisService.hGet(
      'userSocketMap',
      receiver,
    );

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newChatItem', {
        type: 'message',
        ...savedMessage,
      });

      // If not active chat, send unread count
      if (receiverActiveWith !== sender) {
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conversation.id,
            receiverId: receiver,
            isRead: false,
          },
        });

        this.server.to(receiverSocketId).emit('unreadCountUpdate', {
          conversationId: conversation.id,
          count: unreadCount,
          from: sender,
        });
      }
    }

    // Emit message to sender
    client.emit('newChatItem', {
      type: 'message',
      ...savedMessage,
    });

    client.emit('sendSuccessfully', {
      type: 'message',
      ...savedMessage,
    });
  }

  // @SubscribeMessage('loadMessages')
  // async handleLoadMessages(
  //   @MessageBody() data: { userId1: string; userId2: string },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const [user1Id, user2Id] = [data.userId1, data.userId2].sort();

  //   const conversation = await this.prisma.conversation.findFirst({
  //     where: { user1Id, user2Id },
  //   });

  //   if (!conversation) {
  //     client.emit('conversationItems', []);
  //     return;
  //   }

  //   // Mark messages as read
  //   await this.prisma.message.updateMany({
  //     where: {
  //       conversationId: conversation.id,
  //       receiverId: data.userId1,
  //       isRead: false,
  //     },
  //     data: { isRead: true },
  //   });

  //   await this.redisService.hSet(
  //     'userActiveChatMap',
  //     data.userId1,
  //     data.userId2,
  //   );

  //   // Fetch both messages and offers
  //   const [messages, offers] = await Promise.all([
  //     this.prisma.message.findMany({
  //       where: { conversationId: conversation.id },
  //       orderBy: { createdAt: 'asc' },
  //     }),
  //     this.prisma.offer.findMany({
  //       where: { conversationId: conversation.id },
  //       orderBy: { createdAt: 'asc' },
  //     }),
  //   ]);

  //   // Merge into one array with type tags
  //   const merged = [
  //     ...messages.map((m) => ({
  //       type: 'message',
  //       id: m.id,
  //       text: m.text,
  //       senderId: m.senderId,
  //       receiverId: m.receiverId,
  //       createdAt: m.createdAt,
  //     })),
  //     ...offers.map((o) => ({
  //       type: 'offer',
  //       id: o.id,
  //       message: o.message,
  //       price: o.price,
  //       senderId: o.senderId,
  //       receiverId: o.receiverId,
  //       status: o.status,
  //       createdAt: o.createdAt,
  //     })),
  //   ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  //   this.server.to(client.id).emit('conversationItems', merged);

  //   this.server.to(client.id).emit('unreadCountUpdate', {
  //     conversationId: conversation.id,
  //     count: 0,
  //     from: data.userId2,
  //   });
  // }

  @SubscribeMessage('loadMessages')
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleLoadMessages(
    @MessageBody() data: { userId1: string; userId2: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const [user1Id, user2Id] = [data.userId1, data.userId2].sort();

      const conversation = await this.prisma.conversation.findFirst({
        where: { user1Id, user2Id },
      });

      if (!conversation) {
        client.emit('conversationItems', []);
        return;
      }

      await this.prisma.message.updateMany({
        where: {
          conversationId: conversation.id,
          receiverId: data.userId1,
          isRead: false,
        },
        data: { isRead: true },
      });

      await this.redisService.hSet(
        'userActiveChatMap',
        data.userId1,
        data.userId2,
      );

      const messages = await this.prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' },
      });

      const formattedMessages = messages.map((m) => ({
        type: 'message' as const,
        id: m.id,
        text: m.text,
        senderId: m.senderId,
        receiverId: m.receiverId,
        createdAt: m.createdAt.toISOString(),
      }));

      this.server.to(client.id).emit('conversationItems', formattedMessages);

      this.server.to(client.id).emit('unreadCountUpdate', {
        conversationId: conversation.id,
        count: 0,
        from: data.userId2,
      });
    } catch (error) {
      console.error('Error in loadMessages:', error);
      client.emit('error', { message: 'Failed to load messages' });
    }
  }

  //   @SubscribeMessage('getConversations')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async handleGetConversations(
  //   @MessageBody() data: { userId: string; receiverRole?: Role },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const { userId, receiverRole } = data;

  //   const conversations = await this.prisma.conversation.findMany({
  //     where: {
  //       OR: [{ user1Id: userId }, { user2Id: userId }],
  //     },
  //     orderBy: {
  //       lastMessageAt: 'desc',
  //     },
  //   });

  //   if (!conversations.length) {
  //     client.emit('conversationsLoaded', []);
  //     return;
  //   }

  //   // Group unread messages by conversation
  //   const unreadCounts = await this.prisma.message.groupBy({
  //     by: ['conversationId'],
  //     where: {
  //       receiverId: userId,
  //       isRead: false,
  //     },
  //     _count: { _all: true },
  //   });

  //   const chatUsers = await Promise.all(
  //     conversations.map(async (conv) => {
  //       const receiverId = conv.user1Id === userId ? conv.user2Id : conv.user1Id;

  //       // Fetch receiver user with profile
  //       const receiverUser = await this.prisma.user.findUnique({
  //         where: { id: receiverId, ...(receiverRole && { role: receiverRole }) },
  //         include: { profile: true },
  //       });
  //       if (!receiverUser) return null;

  //       // Get last message in this conversation
  //       const lastMessage = await this.prisma.message.findFirst({
  //         where: { conversationId: conv.id },
  //         orderBy: { createdAt: 'desc' },
  //       });

  //       // Find unread count for this conversation
  //       const unreadObj = unreadCounts.find(
  //         (x) => x.conversationId === conv.id,
  //       );

  //       return {
  //         id: receiverUser.id,
  //         unreadCount: unreadObj?._count._all || 0,
  //         lastMessage,
  //         profile: receiverUser.profile?.image,
  //         role: receiverUser.role,
  //         name: receiverUser.profile?.name,
  //         conversationId: conv.id,
  //       };
  //     }),
  //   );

  //   client.emit(
  //     'conversationsLoaded',
  //     chatUsers.filter(Boolean),
  //   );
  // }

  @SubscribeMessage('getConversations')
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleGetConversations(
    @MessageBody()
    data: GetConversationsDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, receiverRole, onlyUnread } = data;

    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    if (!conversations.length) {
      client.emit('conversationsLoaded', []);
      return;
    }

    // Group unread messages by conversation
    const unreadCounts = await this.prisma.message.groupBy({
      by: ['conversationId'],
      where: {
        receiverId: userId,
        isRead: false,
      },
      _count: { _all: true },
    });

    let filteredConversations = conversations;

    // If onlyUnread is true, keep only conversations with unread messages
    if (onlyUnread) {
      const unreadConversationIds = unreadCounts.map((u) => u.conversationId);
      filteredConversations = filteredConversations.filter((c) =>
        unreadConversationIds.includes(c.id),
      );
    }

    const chatUsers = await Promise.all(
      filteredConversations.map(async (conv) => {
        const receiverId =
          conv.user1Id === userId ? conv.user2Id : conv.user1Id;

        // Fetch receiver user with profile
        const receiverUser = await this.prisma.user.findUnique({
          where: {
            id: receiverId,
            ...(receiverRole && { role: receiverRole }),
          },
          include: { profile: true },
        });
        if (!receiverUser) return null;

        // Get last message in this conversation
        const lastMessage = await this.prisma.message.findFirst({
          where: { conversationId: conv.id },
          orderBy: { createdAt: 'desc' },
        });

        // Find unread count for this conversation
        const unreadObj = unreadCounts.find(
          (x) => x.conversationId === conv.id,
        );

        return {
          id: receiverUser.id,
          unreadCount: unreadObj?._count._all || 0,
          lastMessage,
          profile: receiverUser.profile?.image,
          role: receiverUser.role,
          name: receiverUser.profile?.name,
          conversationId: conv.id,
        };
      }),
    );

    client.emit('conversationsLoaded', chatUsers.filter(Boolean));
  }

  @SubscribeMessage('markConversationRead')
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleMarkConversationRead(
    @MessageBody() data: { userId: string; conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, conversationId } = data;

    // Step 1: Mark all unread messages as read
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    await this.redisService.hDel('userActiveChatMap', userId);

    // Step 3: Emit updated unread count (0)
    client.emit('unreadCountUpdate', {
      conversationId,
      count: 0,
      from: null,
    });
  }

  @SubscribeMessage('focusChat')
  async handleFocusChat(@MessageBody() data: { userId: string }) {
    await this.redisService.hSet('userActiveChatMap', data.userId, data.userId);
  }

  @SubscribeMessage('blurChat')
  async handleBlurChat(@MessageBody() data: { userId: string }) {
    // userId left the active chat view
    await this.redisService.hDel('userActiveChatMap', data.userId);
    console.log('hite here successfully blurchat');
  }

  @SubscribeMessage('isUserActive')
  async isUserActive(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const socketId = await this.redisService.hGet('userSocketMap', data.userId);
    const isActive = !!socketId;
    client.emit('isUserActiveResponse', {
      userId: data.userId,
      active: isActive,
    });
  }
}
