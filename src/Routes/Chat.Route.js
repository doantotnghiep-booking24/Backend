import express from 'express';
import { sendMessage, getMessages, GetAllChat, GetChatById } from '../App/Controllers/Chat_Controller.js';

const router = express.Router();

// Route gửi tin nhắn
router.post('/send', sendMessage);

// Route lấy tin nhắn giữa hai người dùng
router.get('/:userId', getMessages);
router.get('/chats/:id', GetChatById);
router.get('/GetAllChat', GetAllChat) 
router.get('/', GetAllChat) 

export default router;
