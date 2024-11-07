import express from 'express'
import Hotel_Controller from '../App/Controllers/Hotel_Controller.js'
import uploadCloud from '../App/MiddleWare/Cloundinary.js'
const Router = express.Router()
Router.get('/GetHotel', Hotel_Controller.GetAllHotel) // http://localhost:3001/Hotel/GetHotel
Router.post('/CreateHotel',uploadCloud.array('Image_Hotel'), Hotel_Controller.CreateHotel) // http://localhost:3001/Hotel/CreateHotel
Router.post('/UpdateHotel/:id',uploadCloud.array('Image_Hotel'), Hotel_Controller.UpdateHotel) // http://localhost:3001/Hotel/UpdateHotel/66a46a2852a8d1dbe7a70291
Router.post('/DeleteHotel/:id', Hotel_Controller.DeleteHotel) // http://localhost:3001/Hotel/DeleteHotel/66a46a2852a8d1dbe7a70291
Router.get('/', Hotel_Controller.GetAllHotel)
export default Router