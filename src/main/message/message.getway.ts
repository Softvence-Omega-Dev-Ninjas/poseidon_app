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
import { Injectable } from '@nestjs/common';
import { RedisService } from './message.services';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import * as jwt from 'jsonwebtoken';
import { PayloadType } from 'src/auth/guard/jwtPayloadType';
import { Role } from 'src/auth/guard/role.enum';
import { read } from 'fs';

type MessagePayload = {
  text: string;
  sender: string;
  receiver: string;
};

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async handleConnection(client: Socket) {
    let token = client.handshake.auth?.token ||
        client.handshake.headers?.authorization;
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
      
      const decoded = jwt.verify(token, process.env.AUTHSECRET) as PayloadType;
      const userId = decoded.id;

   

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
       console.log('User found:', user);
      if (!user) {
        client.emit('error', { message: 'User not found.' });
        client.disconnect();
        return;
      }

   
   
      await this.redisService.hSet('userSocketMap', userId, client.id);

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
     
    }
  }


@SubscribeMessage('sendMessage')
async handleSendMessage(
  @MessageBody() data: MessagePayload,
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
      this.prisma.user.findUnique({ where: { id: sender }, include: { profile: true } }),
      this.prisma.user.findUnique({ where: { id: receiver }, include: { profile: true } }),
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
        isRead: receiverActiveWith === sender,
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


  @SubscribeMessage('getConversations')
async handleGetConversations(
  @MessageBody() data: { userId: string; receiverRole?: Role },
  @ConnectedSocket() client: Socket,
) {
  const { userId, receiverRole } = data;

  const conversations = await this.prisma.conversation.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
    orderBy: {
      lastMessageAt: 'desc',
    },
  });

  if (!conversations) {
    client.emit('conversationsLoaded', []);
    return;
  }

  // Determine conversation partners
  const userIds = conversations.map((c) =>
    c.user1Id === userId ? c.user2Id : c.user1Id,
  );

  // Fetch users with optional role filter
  const users = await this.prisma.user.findMany({
    where: {
      id: { in: userIds },
      ...(receiverRole && { role: receiverRole }),
    },
  });

  // Group unread messages by sender
  const unreadCounts = await this.prisma.message.groupBy({
    by: ['senderId'],
    where: {
      receiverId: userId,
      isRead: false,
    },
    _count: { _all: true },
  });

  // Build chat user response
  const chatUsers = users.map((u) => {
    const countObj = unreadCounts.find((x) => x.senderId === u.id);
    return {
      id: u.id,
      hasGoogleAccount: true,
      unreadCount: countObj?._count._all || 0,
    };
  });

  client.emit('conversationsLoaded', chatUsers);
}

@SubscribeMessage('markConversationRead')
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


}
