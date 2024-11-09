
function Admin(req, res, next) {
    const user = req.cookies.auth
    const userParser = JSON.parse(user)._id

    console.log(userParser);
    
    if (user.role === 'Admin' || user.role === 'admin') {
        // console.log('You are Admin');
        next()
    } else {
        // console.log('You are not Admin, dont permission');
        return res.status(400).json('You are not Admin ,dont have permission')
    }
}

export default Admin;