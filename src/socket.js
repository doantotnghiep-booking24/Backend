// socket.js
import { Server } from 'socket.io';
import { ObjectId } from 'mongodb';
import Connection from "./Config/db/index.js"
import Comments from './App/Models/Comments.js';
import Chat from './App/Models/Chat.js';
import { corsOptions } from './Config/cors.js';
const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: corsOptions
  });
  const chat = new Chat();

  io.on('connection', (socket) => {
    socket.on('sendMessage', async (newMessage, callback) => {
      try {
        // Lưu tin nhắn vào MongoDB
        // console.log('A user connected', socket.id);
        // console.log('newMessage', newMessage);

        Connection.connect().then(async (db) => {
          try {
            // check id user & id_receit có tồn tại không, chưa thì tạo,có thì update text message
            const result = await chat.CheckIsChats(db, newMessage.senderId, newMessage.receiverId)
            // console.log('result', result);
            if (!result) {
              const resultCreateChat = await Chat.createMessage(db, newMessage)
              console.log(resultCreateChat);
              // Gửi thông báo tin nhắn đầu tiên
              io.to(socket.id).emit('showFirstMessageNotice', {
                message: 'Xin cảm ơn bạn đã liên hệ đến F5 Travel! Mọi thắc mắc sẽ được chúng tôi phản hồi trong vòng thời gian ngắn nhất!!',
              });
              if (newMessage) {
                io.emit('receiveMessage', newMessage)  // Phát tin nhắn tới client
                callback({ status: 'success', messages: 'Message sent successfully' });
              }
            } else {
              const updateMessage = await db.collection('Chats').updateOne({
                $and: [
                  { _id: result?._id },
                  // { receiverId: newMessage.receiverId }
                ]
              }, {
                $push: {
                  messages: {
                    senderId: newMessage.messages[[0]].senderId,
                    receiverId: newMessage.messages[[0]].receiverId,
                    text: newMessage.messages[0].text,
                    time: new Date(),
                    role: newMessage.messages[0].role,
                  }
                }
              })
              if (newMessage) {
                io.emit('receiveMessage', newMessage)  // Phát tin nhắn tới client
                callback({ status: 'success', messages: 'Message sent successfully' });
              }
            }


          } catch (error) {

          }
        })

      } catch (error) {
        console.error('Error while sending message:', error);
        callback({ status: 'error', error: 'Internal server error' });
      }
    });


    socket.on('toggleLikeComment', async ({ commentId, userId }) => {
      try {
        const db = await Connection.connect();
        const updatedComment = await Comments.toggleLikeComment(db, commentId, userId);
        console.log(updatedComment);

        io.emit('comment liked', updatedComment); // Sự kiện 'comment liked'
      } catch (e) {
        console.log('Error toggling like:', e);
      }
    });

    socket.on('toggleDisLikeComment', async ({ commentId, userId }) => {
      try {
        const db = await Connection.connect();
        const updateDisLikeComment = await Comments.toggleDislikeComment(db, commentId, userId);
        io.emit('comment disliked', updateDisLikeComment);
      } catch (e) {
        console.log("Error serve ", e);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });

  return io;
};

export default setupSocket;