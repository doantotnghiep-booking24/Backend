class User {
    constructor(_id, Name, Email, Password, photoUrl, Role, typeLogin) {
        this._id = _id
        this.Name = Name
        this.Email = Email
        this.Password = Password
        this.photoUrl = photoUrl
        this.role = Role
        this.typeLogin = typeLogin
    }
    // Register
    static async Check_UserisExist(db, Email) {
        try {
            const result_check = await db.collection('Users').findOne({ Email: Email })
            return result_check
        } catch (error) {
            console.log('Error', error);
            throw error;
        }
    }
    async Create_User(db) {
        try {
            return await db.collection('Users').insertOne(this);
        } catch (err) {
            console.error(`Error: ${err}`);
            throw err;
        }
    }

    // Login
    static async Find_user(db, Email) {
        try {
            return await db.collection('Users').findOne({ Email: Email })

        } catch (error) {
            console.log('error', error);
        }
    }
    static async Find_EmailUser(db, id_User) {
        try {
            return await db.collection('Users').find({ _id: id_User }).toArray()

        } catch (error) {
            console.log('error', error);
        }
    }
    static async GetUserById(db, id) {
        try {
            return await db.collection('Users').findOne({ _id: id })

        } catch (error) {
            console.log('error', error);
        }
    }

    static async saveVerificationCode(db, email, code) {
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // Thời gian hết hạn: 10 phút
        try {
            const result = await db.collection('Users').updateOne(
                { Email: email }, // Tìm người dùng theo email
                {
                    $set: {
                        code: code, // Lưu mã xác nhận
                        code_expiration: expirationTime // Lưu thời gian hết hạn
                    }
                }
            );
            console.log(result);

            return result;
        } catch (error) {
            console.error("Error updating verification code:", error);
            throw new Error("Could not save verification code");
        }
    }


    static async findByCode(db, code) {
        try {
            const user = await db.collection('Users').findOne({ code: code });
            return user;
        } catch (error) {
            throw new Error(error);
        }
    }


    static async updatePassword(db, email, newPassword) {
        try {
            const result = await db.collection('Users').updateOne(
                { Email: email },
                { $set: { Password: newPassword } }
            );
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

}
export default User