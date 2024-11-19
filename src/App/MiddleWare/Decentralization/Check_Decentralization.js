import Connection from '../../../Config/db/index.js'
function Check_Decentralization(req, res, next) {
    Connection.connect().then(async (db) => {
        let Acounts_User = await db.collection('Users').find({}).toArray()
        let Email = req.body.Email
        if (!Email) return res.status(404).send({ message: "Bạn chưa đăng kí tài khoản vui lòng đăng kí để đăng nhập vào hệ thống" })
        let Account = Acounts_User.find(acc => acc.Email === Email)

        if (!Account) return res.status(404).send({ message: "Tài khoản không tồn tại. Vui lòng đăng ký." });

        if (Account.role === 'Admin' || Account.role === 'admin') {
            res.cookie('Role', JSON.stringify(Account))
            console.log('you have permission access');
            setTimeout(() => {
                next()
            })
        } else if (Account.role === 'User' || Account.role === 'user') {
            res.cookie('Role', JSON.stringify(Account))
            console.log('User');
            setTimeout(() => {
                next()
            })
        } else {
            return res.status(403).send({ message: "Bạn không có quyền truy cập." });
        }
    })
}

export default Check_Decentralization;