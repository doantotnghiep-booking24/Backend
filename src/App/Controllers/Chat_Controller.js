import Chat from '../Models/Chat.js';
import Connection from '../../Config/db/index.js';

// Xử lý gửi tin nhắn
export const sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;


  try {
    const newMessage = await Chat.createMessage(senderId, receiverId, message);
    res.status(200).json(newMessage);  // Trả về tin nhắn đã gửi
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Xử lý lấy tin nhắn
export const getMessages = async (req, res) => {
  Connection.connect().then(async (db) => {
    const { userId } = req.params;
    // const loggedInUserId = req.userId; // ID của người dùng đã đăng nhập
    console.log('userId', userId);
    try {
      const messages = await Chat.getMessagess(db, userId);
      res.status(200).json(messages);  // Trả về danh sách tin nhắn
      // console.log(messages);

    } catch (error) {
      res.status(500).json({ message: 'Error fetching messages', error });
    }
  })
};

export const GetAllChat = (req, res, next) => {
  Connection.connect().then(async (db) => {
    try {
      const Allchat = await Chat.getAll(db)
      if (Allchat) return res.status(200).json({ Chat: Allchat })
    } catch (error) {
      console.log(error);
    }
  })
};

export const GetChatByIdUser = (req, res, next) => {
  const { id_User } = req.params;
  
  Connection.connect().then(async (db) => {
    try {
      const chatByIdUser = await Chat.findByIdUser(db, id_User);
      return res.status(200).json({ Chat: chatByIdUser });
    } catch (error) {
      console.log(error);

    }
  })
}
