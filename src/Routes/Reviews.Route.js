import express from 'express'
import Reviews_Controller from '../App/Controllers/Reviews_Controller.js'
import uploadCloudComment from '../App/MiddleWare/ImageComment.js'
import Auth from "../App/MiddleWare/Jwt/Auth.js"
import Admin from '../App/MiddleWare/Decentralization/Admin.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
const Router = express.Router()


Router.get("/GetAllReview", Reviews_Controller.fetchAllComment) 
Router.get('/GetReview/:id',  Reviews_Controller.GetAllReviews)  // Vd :  http://localhost:3001/V1/Review/GetReview
Router.post('/GetReview/:id', AuthUser(["Admin", "User", "Staff"]), Reviews_Controller.remoteComment)
Router.post('/AddNewReview', AuthUser(["Admin", "User", "Staff"]), uploadCloudComment.array('Image'), (req, res) => {
    req.io = req.app.get('io'); // Lấy io từ app
    Reviews_Controller.CreateNew(req, res);
});  // Vd :  http://localhost:3001/V1/Review/AddNewReview

export default Router
