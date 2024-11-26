import { ObjectId } from 'mongodb';
import Connection from "../../Config/db/index.js"; // Ensure this path is correct

class Chat {
  constructor(senderId, receiverId, message, time) {
    this.senderId = senderId; // Gửi bởi người dùng
    this.receiverId = receiverId; // Nhận bởi người dùng
    this.message = message; // Nội dung tin nhắn
    this.time = time; // Thời gian gửi tin nhắn
  }
  static async getAll(db) {
    try {
      const result = await db.collection('Chats')
        .find({})
        .toArray()
      return result
    } catch (error) {
      console.log(error);
      throw (error)
    }
  }
  // Lưu tin nhắn mới vào cơ sở dữ liệu
  static async createMessage(db, newMessages) {
    try {
      // Lưu tin nhắn vào collection 'Chats'
      const result = await db.collection('Chats').insertOne(newMessages);
      // Trả về tin nhắn vừa được lưu với insertedId
      return result;  // Thêm _id vào đối tượng tin nhắn
    } catch (error) {
      console.error('Error creating message:', error);
    }
  }

  // Lấy tất cả tin nhắn giữa hai người dùng
  static async getMessagess(db, userId) {
    try {
      const messages = await db.collection('Chats').find({ senderId: userId })
        .sort({ time: 1 })  // Sắp xếp theo thời gian gửi tin nhắn
        .toArray();
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  // Kiểm tra xem người dùng đã gửi tin nhắn cho admin chưa
  async checkIfUserHasSentMessage(userId) {
    try {
      const db = await Connection.connect();
      const message = await db.collection('Chats').findOne({
        $or: [
          { senderId: userId, receiverId: '67318dd0e23a808c2ecfbb43' }, // Người dùng gửi cho admin
          { senderId: '67318dd0e23a808c2ecfbb43', receiverId: userId }   // Admin gửi cho người dùng
        ]
      });
      return message ? true : false;  // Trả về true nếu có tin nhắn giữa người dùng và admin
    } catch (error) {
      console.error('Error checking if user has sent a message:', error);
    }
  }

  async CheckIsChats(db, senderId, receiverId) {
    try {
      const messages = await db.collection('Chats').findOne({ $and: [{ senderId: senderId }, { receiverId: receiverId }] })
      return messages
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }
  async findByidChat(db, id_User, id_Admin) {
    try {
      const messages = await db.collection('Chats').find({ senderId: id_User, receiverId: id_Admin })
        .toArray();
      return messages
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  static async findById(db, id) {
    try {
      console.log('id', id);

      const messages = await db.collection('Chats').find({ _id: id }).toArray();
      return messages
    } catch (error) {
      console.log('Lỗi', error);

    }
  }
};

export default Chat;
