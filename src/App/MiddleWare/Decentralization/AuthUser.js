import { ObjectId } from "mongodb";
import Connection from '../../../Config/db/index.js';

const AuthUser = (permissions) => {
    return async (req, res, next) => {
        try {
            const originPort = req.headers.origin.split(':').pop();
            console.log('originPort',originPort)
            const cookieName = originPort === '5173' ? 'auth' : 'authAdmin';
            const user = req.cookies[cookieName];
console.log(user);

            if (!user) {
                return res.status(401).json({ message: "You need to sign in" });
            }

            const userParser = JSON.parse(user)._id;

            const db = await Connection.connect();
            const userId = await db.collection('Users').findOne({ _id: new ObjectId(userParser) });

            if (!userId) {
                return res.status(404).json({ message: "Vui lòng đăng nhập" });
            }

            if (!permissions.includes(userId.role)) {
                return res.status(403).json({ message: "Bạn không có quyền truy cập vào tài nguyên này!!" });
            }

            next();
        } catch (error) {
            console.error("Authorization error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };
};

export default AuthUser;
