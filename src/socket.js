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

              // for (let i = 0; i < newMessage.messages.length; i++) {
              //   const updateChat = await db.collection('Chats').updateOne(
              //     { _id: { $in: [result._id] } },
              //     { $set: { "messages.$[elem].senderId": newMessage.messages[i].senderId, "messages.$[elem].receiverId": newMessage.messages[i].receiverId, "messages.$[elem].text": newMessage.messages[i].text, "messages.$[elem].time": newMessage.messages[i].time, "messages.$[elem].role": newMessage.messages[i].role } },
              //     {
              //       arrayFilters: [
              //         { "elem.senderId": newMessage.messages[i].senderId }, // Thay 1 bằng index của object bạn muốn cập nhật
              //         { "elem.receiverId": newMessage.messages[i].receiverId }
              //       ]
              //     }
              //   )
              //   console.log('updateChat', updateChat);
              // }
            }
            // console.log('newMessage',newMessage.messages[0].id_Room);
            // const newIdroom = new ObjectId(newMessage.messages[0].id_Room)
            // console.log('newIdroom',newIdroom);

            // const findChat = result.some(chat => chat?._id === new ObjectId(newMessage.messages[0].id_Room))
            // console.log('findChat', findChat);
            // if (result.isBoolean) {
            // const updateMessage = await db.collection('Chats').updateOne({
            //   $and: [
            //     { _id: result?.messages._id },
            //     // { receiverId: newMessage.receiverId }
            //   ]
            // }, {
            //   $push: {
            //     message: {
            //       id_Room : newMessage?.messages[0]?.id_Room ,
            //       senderId: newMessage.senderId,
            //       receiverId: newMessage.receiverId,
            //       text: newMessage.messages[0].text,
            //       time: new Date(),
            //       role: newMessage.messages[0].role,
            //     }
            //   }
            // })
            //   console.log('updateMessage', updateMessage)
            // } else {
            //   // let room_id = 0
            //   const savedMessage = await chat.createMessage(
            //     newMessage.senderId,
            //     newMessage.receiverId,
            //     newMessage.messages, 

            //   );

            //   // Nếu tin nhắn được lưu thành công, gửi lại cho client
            //   if (savedMessage) {
            //     console.log('savedMessage', savedMessage);
            //     let id_room = savedMessage._id
            // for(let i = 0 ; i < newMessage.messages.length ; i++){
            //   const updateChat = db.collection('Chats').updateOne(
            //     { _id: { $in: [id_room] } },
            //     { $set: { "message.$[elem].id_Room" : id_room } },
            //     {
            //       arrayFilters: [
            //         { "elem._id": savedMessage[i] } // Thay 1 bằng index của object bạn muốn cập nhật
            //       ]
            //     }
            //   )
            //   console.log('updateChat',updateChat);
            // }

            //   io.emit('receiveMessage', newMessage)  // Phát tin nhắn tới client
            //   callback({ status: 'success', messages: 'Message sent successfully' });
            // } else {
            //   callback({ status: 'error', error: 'Failed to save message' });
            // }
            // }

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