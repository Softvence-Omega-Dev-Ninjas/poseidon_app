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
    console.log(`Socket connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const userSocketMap = await this.redisService.hGetAll('userSocketMap');
    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === client.id,
    );

    if (userId) {
      await this.redisService.hDel('userSocketMap', userId);
      await this.redisService.hDel('userActiveChatMap', userId);
      console.log(`User ${userId} disconnected and removed`);
    }
  }

  @SubscribeMessage('register')
  async handleRegister(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.redisService.hSet('userSocketMap', data.userId, client.id);
    console.log(`User ${data.userId} registered with socket ${client.id}`);
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

  // Create conversation if not exists
  if (!conversation) {
    conversation = await this.prisma.conversation.create({
      data: { user1Id, user2Id },
    });

    const [senderUser, receiverUser] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: sender } }),
      this.prisma.user.findUnique({ where: { id: receiver } }),
    ]);

    const newChatUserForReceiver = {
      id: senderUser?.id,
     
      hasGoogleAccount: true,
      unreadCount: 1,
    };

    const newChatUserForSender = {
      id: receiverUser?.id,
      hasGoogleAccount: true,
      unreadCount: 0,
    };

    const [receiverSocketId, senderSocketId] = await Promise.all([
      this.redisService.hGet('userSocketMap', receiver),
      this.redisService.hGet('userSocketMap', sender),
    ]);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newConversation', newChatUserForReceiver);
    }

    if (senderSocketId) {
      this.server.to(senderSocketId).emit('newConversation', newChatUserForSender);
    }
  }

  const receiverActiveWith = await this.redisService.hGet(
    'userActiveChatMap',
    receiver,
  );

  const savedMessage = await this.prisma.message.create({
    data: {
      text,
      senderId: sender,
      receiverId: receiver,
      conversationId: conversation.id,
      isRead: receiverActiveWith === sender,
    },
  });

  await this.prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date() },
  });

  const receiverSocketId = await this.redisService.hGet(
    'userSocketMap',
    receiver,
  );

  // Emit to receiver
  if (receiverSocketId) {
    this.server.to(receiverSocketId).emit('newChatItem', {
      type: 'message',
      ...savedMessage,
    });

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

  // Emit to sender
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

    // Mark unread messages as read for userId1
    await this.prisma.message.updateMany({
      where: {
        conversationId: conversation.id,
        receiverId: data.userId1,
        isRead: false,
      },
      data: { isRead: true },
    });

    // Update Redis active chat map
    await this.redisService.hSet('userActiveChatMap', data.userId1, data.userId2);

    // Fetch messages and offers
    const [messages, offers] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.offer.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Merge and sort by createdAt timestamp ascending
    const merged = [
      ...messages.map((m) => ({
        type: 'message' as const,
        id: m.id,
        text: m.text,
        senderId: m.senderId,
        receiverId: m.receiverId,
        createdAt: m.createdAt.toISOString(),
      })),
      ...offers.map((o) => ({
        type: 'offer' as const,
        id: o.id,
        message: o.message,
        price: o.price,
        senderId: o.senderId,
        receiverId: o.receiverId,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      })),
    ].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Send merged conversation items to client socket only
    this.server.to(client.id).emit('conversationItems', merged);

    // Reset unread count UI for this conversation on client
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
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;

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

    const userIds = conversations.map((c) =>
      c.user1Id === userId ? c.user2Id : c.user1Id,
    );

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    const unreadCounts = await this.prisma.message.groupBy({
      by: ['senderId'],
      where: {
        receiverId: userId,
        isRead: false,
      },
      _count: { _all: true },
    });

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


@SubscribeMessage('createOffer')
async handleCreateOffer(
  @MessageBody()
  data: {
    senderId: string;
    receiverId: string;
    message: string;
    price: number;
  },
  @ConnectedSocket() client: Socket,
) {
  const { senderId, receiverId, message, price } = data;
  const [user1Id, user2Id] = [senderId, receiverId].sort(); // maintain order

  // Step 1: Find or create conversation
  let conversation = await this.prisma.conversation.findFirst({
    where: { user1Id, user2Id },
  });

  if (!conversation) {
    conversation = await this.prisma.conversation.create({
      data: {
        user1: { connect: { id: user1Id } },
        user2: { connect: { id: user2Id } },
      },
    });
  }

  // Step 2: Create offer
  const offer = await this.prisma.offer.create({
    data: {
      conversationId: conversation.id,
      senderId,
      receiverId,
      message,
      price,
    },
  });

  // Step 3: Emit to receiver and sender
  const [receiverSocketId, senderSocketId] = await Promise.all([
    this.redisService.hGet('userSocketMap', receiverId),
    this.redisService.hGet('userSocketMap', senderId),
  ]);

  const offerPayload = {
    type: 'offer',
    ...offer,
  };

  if (receiverSocketId) {
    this.server.to(receiverSocketId).emit('newChatItem', offerPayload);
  }

  if (senderSocketId) {
    this.server.to(senderSocketId).emit('newChatItem', offerPayload);
  }

  // Optional: send acknowledgment to sender socket
 client.emit('offerCreated', {
  type: 'offer',
  ...offer,
});

}




@SubscribeMessage('updateOffer')
async handleUpdateOffer(
  @MessageBody()
  data: {
    offerId: string;
    userId: string;
    message?: string;
    price?: number;
    action?: 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  },
  @ConnectedSocket() client: Socket,
) {
  const offer = await this.prisma.offer.findUnique({
    where: { id: data.offerId },
  });

  if (!offer) return;

  // Prevent editing ACCEPTED or REJECTED offers
  if (['ACCEPTED', 'REJECTED'].includes(offer.status)) return;

  const isSender = offer.senderId === data.userId;
  const isReceiver = offer.receiverId === data.userId;

  // Rules
  if (data.action === 'CANCELLED' && !isSender) return;
  if (['ACCEPTED', 'REJECTED'].includes(data.action || '') && !isReceiver) return;
  if ((data.message || data.price !== undefined) && !isSender) return;

  // Prepare fields to update
  const updatePayload: any = {};
  if (data.action) updatePayload.status = data.action;
  if (data.message) updatePayload.message = data.message;
  if (data.price !== undefined) updatePayload.price = data.price;

  const updatedOffer = await this.prisma.offer.update({
    where: { id: data.offerId },
    data: updatePayload,
  });

  const [senderSocketId, receiverSocketId] = await Promise.all([
    this.redisService.hGet('userSocketMap', offer.senderId),
    this.redisService.hGet('userSocketMap', offer.receiverId),
  ]);

  const payload = {
    type: 'offer',
    ...updatedOffer,
  };

  if (senderSocketId) {
    this.server.to(senderSocketId).emit('newChatItem', payload);
  }

  if (receiverSocketId) {
    this.server.to(receiverSocketId).emit('newChatItem', payload);
  }
}


}
