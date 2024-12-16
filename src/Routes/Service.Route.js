import express from 'express'
import Service_Controller from '../App/Controllers/ServiceTour_Controller.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
import Auth from '../App/MiddleWare/Jwt/Auth.js'
const Router = express.Router()
Router.get('/GetAllService', Service_Controller.GetAllService)
Router.post('/CreateService',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]), Service_Controller.CreateService)
Router.post('/UpdateService/:id', Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]), Service_Controller.UpdateService)
Router.post('/DeleteService/:id',Auth.verifyJWTToken,  AuthUser(["Admin", "Staff"]), Service_Controller.DeleteService)
Router.post('/RemoveService/:id',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]), Service_Controller.RemoveService)
Router.post('/RestoreService/:id',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]), Service_Controller.RemoveService)
Router.get('/', Service_Controller.GetAllService)


export default Router