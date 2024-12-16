import express from 'express'
import Featured_Location_Controller from '../App/Controllers/Featured_Location.js'
import uploadCloud from '../App/MiddleWare/Cloundinary.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
import Auth from '../App/MiddleWare/Jwt/Auth.js'
const Router = express.Router()
Router.get('/GetFeatured_Location',  Featured_Location_Controller.GetAllFeatured_Location) // http://localhost:3001/V2/Featured_Location/GetFeatured_Location
Router.post('/CreateFeatured_Location',Auth.verifyJWTToken, AuthUser(['Admin', 'Staff']), uploadCloud.array('Image_Location'), Featured_Location_Controller.CreateFeatured_Location) // http://localhost:3001/V2/Featured_Location/CreateFeatured_Location
Router.get('/DetailLocation/:id', Featured_Location_Controller.DetailLocation) // http://localhost:3001/V2/Featured_Location/DetailLocation/66a46a2852a8d1dbe7a70291
Router.post('/UpdateFeatured_Location/:id',Auth.verifyJWTToken, AuthUser(['Admin', 'Staff']), uploadCloud.array('Image_Location'), Featured_Location_Controller.UpdateFeatured_Location) // http://localhost:3001/V2/Featured_Location/UpdateFeatured_Location/66a46a2852a8d1dbe7a70291
Router.post('/DeleteFeatured_Location/:id',Auth.verifyJWTToken, AuthUser(['Admin', 'Staff']), Featured_Location_Controller.DeleteFeatured_Location) // http://localhost:3001/V2/Featured_Location/DeleteFeatured_Location/66a46a2852a8d1dbe7a70291
Router.post('/RemoveFeatured_Location/:id',Auth.verifyJWTToken, AuthUser(['Admin', 'Staff']), Featured_Location_Controller.RemoveFeatured_Location) // http://localhost:3001/V2/Featured_Location/DeleteFeatured_Location/66a46a2852a8d1dbe7a70291
Router.post('/RestoreFeatured_Location/:id',Auth.verifyJWTToken, AuthUser(['Admin', 'Staff']), Featured_Location_Controller.RemoveFeatured_Location) // http://localhost:3001/V2/Featured_Location/DeleteFeatured_Location/66a46a2852a8d1dbe7a70291
Router.get('/', Featured_Location_Controller.GetAllFeatured_Location)
export default Router
