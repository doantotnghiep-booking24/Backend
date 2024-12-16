import express from 'express'
import News_Controller from '../App/Controllers/News_Controller.js'
import uploadCloud from '../App/MiddleWare/Cloundinary.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
import Auth from "../App/MiddleWare/Jwt/Auth.js"

const Router = express.Router()
Router.get('/GetAllNews',  News_Controller.GetAllNews) // http://localhost:3001/News/GetAllNews
Router.post('/CreateNew',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]),  uploadCloud.array('Image'), News_Controller.CreateNew) // http://localhost:3001/News/CreateNew
Router.post('/UpdateNew/:id',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]),  uploadCloud.array('Image'), News_Controller.UpdateNew) // http://localhost:3001/News/UpdateNew/id
Router.post('/DeleteNew/:id',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]),  News_Controller.DeleteNew) // http://localhost:3001/News/DeleteNew/id
Router.post('/Remove/:id',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]),  News_Controller.RemoveNew) // http://localhost:3001/News/DeleteNew/id
Router.post('/Restore/:id',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]),  News_Controller.RemoveNew) // http://localhost:3001/News/DeleteNew/id
Router.get('/DetailNew/:id',Auth.verifyJWTToken, News_Controller.DetailNew) // http://localhost:3001/News/DetailNews/id
Router.get('/', News_Controller.GetAllNews)


export default Router
