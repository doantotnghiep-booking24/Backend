import express from 'express'
import TourFavourite_Controller from '../App/Controllers/TourFavourite_Controller.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
const Router = express.Router()
Router.get('/GetTourFavourite', TourFavourite_Controller.GetAllTourFavourite) // http://localhost:3001/TourFavourites/GetTourFavourite
Router.post('/CreateTourFavourite',AuthUser(["Admin", "Staff", "User"]), TourFavourite_Controller.CreateTourFavourite) // http://localhost:3001/TourFavourites/CreateTourFavourite
Router.post('/CancleTourFavourite/:id',AuthUser(["Admin", "Staff", "User"]), TourFavourite_Controller.CancleFavourite) // http://localhost:3001/TourFavourites/CancleTourFavourite/id
Router.get('/', TourFavourite_Controller.GetAllTourFavourite)
export default Router