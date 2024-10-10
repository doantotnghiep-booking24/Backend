import express from 'express'
import News_Controller from '../App/Controllers/News_Controller.js'
import uploadCloud from '../App/MiddleWare/Cloundinary.js'
const Router = express.Router()
Router.get('/GetAllNews',News_Controller.GetAllNews) // http://localhost:3001/News/GetAllNews
Router.post('/CreateNew',uploadCloud.array('Image'),News_Controller.CreateNew) // http://localhost:3001/News/CreateNew
Router.post('/UpdateNew/:id',uploadCloud.array('Image'),News_Controller.UpdateNew) // http://localhost:3001/News/UpdateNew/id
Router.post('/DeleteNew/:id',News_Controller.DeleteNew) // http://localhost:3001/News/DeleteNew/id
Router.get('/',News_Controller.GetAllNews)


export default Router