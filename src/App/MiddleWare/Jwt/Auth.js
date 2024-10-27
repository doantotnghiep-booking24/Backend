import jwt from "jsonwebtoken";
import "dotenv/config.js"; // import dotenv to use process.env
import Connection from '../../../Config/db/index.js'

class Auth {
    static createAccessToken(name, email, role) {
        const Payload = {
            name: name,
            email: email,
            role: role
        };
        // console.log('Payload', Payload);

        const options = {
            expiresIn: '1d',
            algorithm: 'HS256'
        };

        const AccessToken = jwt.sign(Payload, process.env.SECRET_KEY_ACCESS_TOKEN, options);

        return AccessToken;
    }
    static GeneralRefeshToken(name, email, role) {
        const Payload = {
            name: name,
            email: email,
            role: role
        }

        const RefeshToken = jwt.sign(Payload, process.env.SECRET_KEY_REFESH_TOKEN, { expiresIn: '1d' })

        return RefeshToken
    }

    // verify token
    static verifyJWTToken = (req, res, next) => {
        // Lấy token từ header Authorization
        const authHeader = req.headers['authorization']; // Đảm bảo sử dụng chuỗi 'authorization'
        console.log(req.headers); // Ghi lại tất cả các header

        console.log(`AuthHeader: ${authHeader}`);
        let token = null;

        if (authHeader) {
            token = authHeader.split(' ')[1]; // Lấy token sau từ khóa 'Bearer'
            console.log(`Token from Header: ${token}`);
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' }); // Nếu không có token, trả về lỗi Unauthorized
        }

        // Kiểm tra tính hợp lệ của token
        jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                console.error(err);
                
                return res.status(403).json({ message: err }); // Nếu token không hợp lệ, trả về lỗi
            } else {
                req.email = decoded.email; // Lưu thông tin email từ token vào req
                next(); // Tiếp tục tới middleware hoặc route tiếp theo
            }
        });
    }

}

export default Auth;