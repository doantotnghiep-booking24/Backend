import express from 'express'
import User_Controller from '../App/Controllers/User_Controller.js'
import Auth from '../App/MiddleWare/Jwt/Auth.js'
import Check_Decentralization from '../App/MiddleWare/Decentralization/Check_Decentralization.js'
const Router = express.Router()
Router.post('/Register',User_Controller.Register)
Router.post('/Login',Check_Decentralization,User_Controller.Login)
Router.post('/RefreshToken',User_Controller.RefeshToken)
Router.get('/',User_Controller.Register)

export default Router