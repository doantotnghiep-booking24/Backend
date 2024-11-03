import express from 'express'
import User_Controller from '../App/Controllers/User_Controller.js'
import Auth from '../App/MiddleWare/Jwt/Auth.js'
import Check_Decentralization from '../App/MiddleWare/Decentralization/Check_Decentralization.js'
const Router = express.Router()
Router.post('/Register', User_Controller.Register) //http://localhost:3001/V1/User/Register
Router.post('/Login', Check_Decentralization, User_Controller.Login)
Router.post('/RefreshToken', User_Controller.RefeshToken)
Router.post('/Password-reset/request', User_Controller.PasswordResetRequest)//http://localhost:3001/User/Password-reset/request
Router.post('/Password-reset/code', User_Controller.PasswordCode)//http://localhost:3001/User/Password-reset/code
Router.post('/LoginWithGoogle', User_Controller.LoginWithGoogle)//http://localhost:3001/User/LoginWithGoogle
Router.post('/LoginWithFacebook', User_Controller.LoginWithFacebook)//http://localhost:3001/User/LoginWithFacebook
Router.get('/GetUser/:id', User_Controller.GetUserById)
Router.get('/', User_Controller.Register)

export default Router
