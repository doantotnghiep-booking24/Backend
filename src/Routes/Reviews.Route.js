import express from 'express'
import Reviews_Controller from '../App/Controllers/Reviews_Controller.js'
import uploadCloudComment from '../App/MiddleWare/ImageComment.js'
const Router = express.Router()

Router.get('/GetReview/:id', Reviews_Controller.GetAllReviews)  // Vd :  http://localhost:3001/V1/Review/GetReview

Router.post('/AddNewReview', uploadCloudComment.array('Image'), (req, res) => {
    req.io = req.app.get('io'); // Lấy io từ app
    Reviews_Controller.CreateNew(req, res);
});  // Vd :  http://localhost:3001/V1/Review/AddNewReview

export default Router