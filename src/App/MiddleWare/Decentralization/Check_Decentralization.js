import Connection from '../../../Config/db/index.js'
function Check_Decentralization(req, res, next) {
    Connection.connect().then(async (db) => {
        let Acounts_User = await db.collection('Users').find({}).toArray()
        let Email = req.body.Email
        let Account = Acounts_User.find(acc => acc.Email === Email)
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
        }
    })
}

export default Check_Decentralization;