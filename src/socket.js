// socket.js
import { Server } from 'socket.io';
import { ObjectId } from 'mongodb';
import Connection from "./Config/db/index.js"
import Comments from './App/Models/Comments.js';
const setupSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

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
