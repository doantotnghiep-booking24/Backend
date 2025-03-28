import express from 'express'
import TourFavourite_Controller from '../App/Controllers/TourFavourite_Controller.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
import Auth from '../App/MiddleWare/Jwt/Auth.js'
const Router = express.Router()
Router.get('/GetTourFavourite', TourFavourite_Controller.GetAllTourFavourite) // http://localhost:3001/TourFavourites/GetTourFavourite
Router.post('/CreateTourFavourite', TourFavourite_Controller.CreateTourFavourite) // http://localhost:3001/TourFavourites/CreateTourFavourite
Router.post('/CancleTourFavourite/:id', TourFavourite_Controller.CancleFavourite) // http://localhost:3001/TourFavourites/CancleTourFavourite/id
Router.get('/', TourFavourite_Controller.GetAllTourFavourite)
export default Router
