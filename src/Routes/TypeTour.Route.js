import express from 'express'
import TypeTour_Controller from '../App/Controllers/TypeTour_Controller.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
import Auth from '../App/MiddleWare/Jwt/Auth.js'
const Router = express.Router()
Router.get('/GetAllTypeTour', TypeTour_Controller.GetAllTypeTour) // http://localhost:3001/V2/TypeTour/GetAllTypeTour
Router.post('/CreateTypeTour',Auth.verifyJWTToken,AuthUser(["Admin", "Staff"]), TypeTour_Controller.CreateTypeTour) // http://localhost:3001/V2/TypeTour/CreateTypeTour
Router.post('/UpdateTypeTour/:id',Auth.verifyJWTToken,AuthUser(["Admin", "Staff"]), TypeTour_Controller.UpdateTypeTour) // http://localhost:3001/V2/TypeTour/UpdateTypeTour/66a46a2852a8d1dbe7a70291
Router.post('/DeleteTypeTour/:id',Auth.verifyJWTToken,AuthUser(["Admin", "Staff"]), TypeTour_Controller.DeleteTypeTour) // http://localhost:3001/V2/TypeTour/DeleteTypeTour/66a46a2852a8d1dbe7a70291
Router.post('/RemoveTypeTour/:id',Auth.verifyJWTToken,AuthUser(["Admin", "Staff"]), TypeTour_Controller.RemoveTypeTour) // http://localhost:3001/V2/TypeTour/DeleteTypeTour/66a46a2852a8d1dbe7a70291
Router.post('/RestoreTypeTour/:id',Auth.verifyJWTToken,AuthUser(["Admin", "Staff"]), TypeTour_Controller.RemoveTypeTour) // http://localhost:3001/V2/TypeTour/DeleteTypeTour/66a46a2852a8d1dbe7a70291
Router.get('/', TypeTour_Controller.GetAllTypeTour)
export default Router