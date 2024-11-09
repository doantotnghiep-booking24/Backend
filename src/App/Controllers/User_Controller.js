import Connection from '../../Config/db/index.js'
import User from '../Models/User.js';
import { ObjectId } from 'mongodb';
import bcrypt from "bcrypt";
import Auth from '../MiddleWare/Jwt/Auth.js';
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import crypto from 'crypto'
import { emailService } from '../Services/emailService.js';

class User_Controller {
    Register(req, res, next) {
        const { Name, Email, Password } = req.body
        const role = 'User' || 'user'
        const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        const isCheckEmail = reg.test(Email)
        if (Name === "" || !isCheckEmail || Password === "") {
            return res
                .status(400)
                .send({ error: 'Vui lòng nhập đầy đủ thông tin để đăng ký!' });
        }
        Connection.connect().then(async (db) => {
            try {
                const result_user = await User.Check_UserisExist(db, Email)
                if (result_user) {
                    return res.status(400).send({ error: 'Email đã tồn tại, Vui lòng nhập Email khác để đăng ký!' })
                } else {
                    bcrypt.hash(Password, 10, (err, hash) => {
                        if (err) {
                            console.log(err);
                        } else {
                            Connection.connect().then(async (db) => {
                                const typeLogin = "regularAccount"
                                const user = new User(undefined, Name, Email, hash, null, role, typeLogin)
                                const result_save = user.Create_User(db)
                                if (result_save) {
                                    console.log('Create new user');
                                    return res.status(200).send({ message: 'Register is successful' })
                                } else {
                                    return res.status(400).send({ message: 'Register is failed' })
                                }
                            })
                        }
                    })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }

    Login(req, res, next) {
        const { Email, Password } = req.body
        const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        const isCheckEmail = reg.test(Email)
        if (Email === "" || Password === "" || !isCheckEmail) {
            return res.status(404).send({ message: 'Please enter complete infomation' })
        }
        console.log(Email, Password);

        Connection.connect().then(async (db) => {
            try {
                const find_user = await User.Find_user(db, Email)


                if (!find_user) {
                    return res.status('404').send({ message: 'Email not found' })
                }
                bcrypt.compare(Password, find_user.Password, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({ message: 'Internal server error' });
                    } else {
                        if (result) {
                            const AccessToken = Auth.createAccessToken(find_user.Name, find_user.Email, find_user.role)
                            const RefeshToken = Auth.GeneralRefeshToken(find_user.Name, find_user.Email, find_user.role)
                            const inforUser = {
                                _id: find_user._id,
                                Name: find_user.Name,
                                Email: find_user.Email,
                                role: find_user.role,
                                AccessToken,
                                RefeshToken
                            }
                            res.status(200).send({ inforUser })
                        } else {
                            return res.status(401).send({ message: 'Mật khẩu không chính xác vui lòng nhập mật khẩu hợp lệ' });
                        }
                    }
                })
            } catch (error) {
                console.log('error', error);
            }
        })
    }
    RefeshToken(req, res, next) {
        Connection.connect().then(async (db) => {
            try {


                const RefreshTokens = req.body.token
                console.log(RefreshTokens);

                if (RefreshTokens) {
                    jwt.verify(RefreshTokens, process.env.SECRET_KEY_REFESH_TOKEN, (err, user) => {
                        if (err) {
                            return res.status(401).send({ message: "The user is not authentication" })
                        }
                        if (user) {
                            const NewAccessToken = Auth.createAccessToken(user.name, user.email, user.role)
                            return res.status(200).send({ user, NewAccessToken: NewAccessToken })
                        } else {
                            return res.status(401).send({ message: "The user is not authentication" })
                        }
                    })
                } else {
                    return res.send({ message: "The refesh token is not valid" })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }

    GetUserById(req, res) {
        const { id } = req.params


        Connection.connect().then(async (db) => {
            try {
                const find_user = await User.GetUserById(db, new ObjectId(id))
                if (!find_user) {
                    console.log(find_user);

                    return res.status(404).send({ message: 'Email not found' })
                }
                res.status(200).json({ userByid: find_user })



            } catch (error) {
                console.log('error', error);
            }
        })
    }

    PasswordResetRequest = async (req, res) => {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: 'Email are required' });

        Connection.connect().then(async (db) => {
            try {
                const user = await User.Find_user(db, email);



                if (!user) throw new Error('Email not found');

                const code = Math.floor(100000 + Math.random() * 900000).toString();


                const result = await User.saveVerificationCode(db, email, code);


                await emailService.sendVerificationEmail(email, code);


                res.status(200).json({ user });
            } catch (error) {
                console.error("Error occurred:", error); // Log lỗi chi tiết
                res.status(500).json({ error: 'Internal Server Error' }); // Sử dụng mã trạng thái 500 cho lỗi nội bộ
            }
        });
    };

    PasswordCode = async (req, res) => {
        const { code, newPassword } = req.body;



        if (!code) return res.status(400).json({ message: 'Code is required.' });
        if (!newPassword) return res.status(400).json({ message: 'New password is required.' });

        Connection.connect().then(async (db) => {
            try {

                const user = await User.findByCode(db, code);
                if (!user) return res.status(400).json({ message: 'Invalid code.' });
                if (user.code_expiration < new Date()) return res.status(400).json({ message: 'Code has expired. Please enter new code!!!' });


                const hashPass = await bcrypt.hash(newPassword, 10);


                const updateResult = await User.updatePassword(db, user.Email, hashPass);
                if (updateResult.modifiedCount === 0) return res.status(400).json({ message: 'Password update failed.' });

                res.status(200).json({ message: 'Password reset successfully' });
            } catch (error) {
                console.error("Error occurred:", error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    };


    LoginWithGoogle(req, res, next) {
        const { Name, Email, photoUrl } = req.body; // Sử dụng lowercase để đồng nhất
        const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        const isCheckEmail = reg.test(Email);

        if (!Name || !Email || !isCheckEmail) {
            return res.status(400).send({ message: 'Please enter complete information' });
        }

        Connection.connect().then(async (db) => {
            try {
                const findUser = await User.Find_user(db, Email);
                if (findUser) {
                    const AccessToken = Auth.createAccessToken(findUser.Name, findUser.Email, findUser.role);
                    const RefreshToken = Auth.GeneralRefeshToken(findUser.Name, findUser.Email, findUser.role);

                    const inforUser = {
                        _id: findUser._id,
                        Name: findUser.Name,
                        Email: findUser.Email,
                        photoUrl: findUser.photoUrl,
                        role: findUser.role,
                        AccessToken,
                        RefreshToken
                    };
                    return res.status(200).send({ inforUser });
                } else {
                    // Tạo người dùng mới mà không cần mật khẩu
                    const role = "User";
                    const typeLogin = "google"
                    const user = new User(undefined, Name, Email, null, photoUrl, role, typeLogin); // Không cần mật khẩu
                    const resultSave = await user.Create_User(db); // Đảm bảo sử dụng await

                    const getNewUser = await User.GetUserById(db, resultSave.insertedId);
                    delete getNewUser.Password; // Xóa password nếu có

                    const accessToken = Auth.createAccessToken(getNewUser.Name, getNewUser.Email, getNewUser.role);
                    const refreshToken = Auth.GeneralRefeshToken(getNewUser.Name, getNewUser.Email, getNewUser.role);

                    const inforUser = {
                        _id: getNewUser._id,
                        Name: getNewUser.Name,
                        Email: getNewUser.Email,
                        photoUrl: getNewUser.photoUrl,
                        role: getNewUser.role,
                        accessToken,
                        refreshToken
                    };
                    return res.status(200).send({ inforUser });
                }
            } catch (error) {
                console.log('Error:', error);
                return res.status(500).send({ message: 'Internal server error' });
            }
        }).catch(error => {
            console.log('Database connection error:', error);
            return res.status(500).send({ message: 'Database connection error' });
        });
    }




    LoginWithFacebook(req, res, next) {
        const { Name, Email, photoUrl } = req.body; // Sử dụng lowercase để đồng nhất
        const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        const isCheckEmail = reg.test(Email);

        if (!Name || !Email || !isCheckEmail) {
            return res.status(400).send({ message: 'Please enter complete information' });
        }

        Connection.connect().then(async (db) => {
            try {
                const findUser = await User.Find_user(db, Email);
                if (findUser) {
                    const AccessToken = Auth.createAccessToken(findUser.Name, findUser.Email, findUser.role);
                    const RefreshToken = Auth.GeneralRefeshToken(findUser.Name, findUser.Email, findUser.role);

                    const inforUser = {
                        _id: findUser._id,
                        Name: findUser.Name,
                        Email: findUser.Email,
                        photoUrl: findUser.photoUrl,
                        role: findUser.role,
                        AccessToken,
                        RefreshToken
                    };
                    return res.status(200).send({ inforUser });
                } else {
                    // Tạo người dùng mới mà không cần mật khẩu
                    const role = "User";
                    const typeLogin = "facebook"
                    const user = new User(undefined, Name, Email, null, photoUrl, role, typeLogin); // Không cần mật khẩu
                    const resultSave = await user.Create_User(db); // Đảm bảo sử dụng await

                    const getNewUser = await User.GetUserById(db, resultSave.insertedId);
                    delete getNewUser.Password; // Xóa password nếu có

                    const accessToken = Auth.createAccessToken(getNewUser.Name, getNewUser.Email, getNewUser.role);
                    const refreshToken = Auth.GeneralRefeshToken(getNewUser.Name, getNewUser.Email, getNewUser.role);

                    const inforUser = {
                        _id: getNewUser._id,
                        Name: getNewUser.Name,
                        Email: getNewUser.Email,
                        photoUrl: getNewUser.photoUrl,
                        role: getNewUser.role,
                        accessToken,
                        refreshToken
                    };
                    return res.status(200).send({ inforUser });
                }
            } catch (error) {
                console.log('Error:', error);
                return res.status(500).send({ message: 'Internal server error' });
            }
        }).catch(error => {
            console.log('Database connection error:', error);
            return res.status(500).send({ message: 'Database connection error' });
        });
    }

    EditInfoUser(req, res) {

        const data = req.body;
        const { id } = req.params;
        let filePath = "";
        if (req?.files?.photoUrl && req.files.photoUrl.length > 0) {
            filePath = req.files.photoUrl[0].path;
            data.photoUrl = filePath;
        }
        Connection.connect().then(async (db) => {
            try {
                const findUser = await User.FindOneByUpdate(db, new ObjectId(id), data);

                if (!findUser) {
                    return res.status(404).send({ message: 'User not found' });
                }
                console.log(findUser);
                return res.status(200).json({ message: "updated successfully", data: findUser })
            } catch (error) {
                console.log('Error:', error);
                return res.status(500).send({ message: 'Internal server error' });
            }
        }).catch(error => {
            console.log('Database connection error:', error);
            return res.status(500).send({ message: 'Database connection error' });
        });
    }
}





export default new User_Controller()