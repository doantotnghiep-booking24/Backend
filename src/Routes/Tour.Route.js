import express from 'express'
import Tour_Controller from '../App/Controllers/Tour_Controller.js'
import uploadCloud from '../App/MiddleWare/Cloundinary.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
import Auth from '../App/MiddleWare/Jwt/Auth.js'
const Router = express.Router()

Router.get('/GetTours', Tour_Controller.GetAllTour)  // Vd :  http://localhost:3001/V1/Tours/GetTours?page=1&limit=1
Router.get('/SearchTour',Tour_Controller.SearchTour) // Vd :  V1/Tours/SearchTour?page=1&limit=2&NameSearch=h&PriceSearch= 250000
Router.get('/DetailTour/:id',  Tour_Controller.DetailTour) // Vd : V1/Tours/DetailTour/669a3bad03ec7167578570d8
Router.get('/AllComment/:id',  Tour_Controller.getAllComments) // Vd : V1/Tours/AllComment/669a3bad03ec7167578570d8
Router.post('/CreateTour',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]), uploadCloud.array('Image_Tour'), Tour_Controller.Create_Tour)
Router.post('/Update/:id',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]), uploadCloud.array('Image_Tour'), Tour_Controller.UpdateTour) // Vd : V1/Tours/Update/669a3bad03ec7167578570d8
Router.post('/Delete/:id',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]), Tour_Controller.DeleteTour) // Vd : V1/Tours/Delete/669a3bad03ec7167578570d8
Router.post('/Restore/:id',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]), Tour_Controller.DeleteTour) // Vd : V1/Tours/Delete/669a3bad03ec7167578570d8
Router.post('/Remove/:id',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]), Tour_Controller.RemoveTour) // Vd : V1/Tours/Delete/669a3bad03ec7167578570d8
Router.get('/', Tour_Controller.GetAllTour)

export default Router