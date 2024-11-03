import express from 'express'
import Custommers_Controller from '../App/Controllers/Customer_Controller.js'
const Router = express.Router()
Router.get('/GetCustommers', Custommers_Controller.GetCustommers) // http://localhost:3001/Custommer/getCustommers

Router.get('/', Custommers_Controller.GetCustommers)
export default Router