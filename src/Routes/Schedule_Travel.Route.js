import express from 'express'
import Schedule_Travel from '../App/Controllers/Schedule_Travel_Controller.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
const Router = express.Router()
Router.get('/GetAllSchedule', Schedule_Travel.GetAllSchedule_Travel) // http://localhost:3001/Schedules/GetAllSchedule
Router.post('/CreateSchedule', AuthUser(["Admin"]), Schedule_Travel.CreateSchedule_Travel) // http://localhost:3001/Schedules/CreateSchedule
Router.get('/GetSchedule/:id',Schedule_Travel.GetSchedule_TravelByid) // http://localhost:3001/Schedules/GetSchedule/id
Router.post('/UpdateSchedule/:id', AuthUser(["Admin"]), Schedule_Travel.UpdateSchedule_Travel) // http://localhost:3001/Schedules/UpdateSchedule/id
Router.post('/DeleteSchedule/:id', AuthUser(["Admin"]), Schedule_Travel.DeleteSchedule_Travel) // http://localhost:3001/Schedules/DeleteSchedule/id
Router.post('/RemoveSchedule/:id', AuthUser(["Admin"]), Schedule_Travel.RemoveSchedule_Travel) // http://localhost:3001/Schedules/DeleteSchedule/id
Router.post('/RestoreSchedule/:id', AuthUser(["Admin"]), Schedule_Travel.RemoveSchedule_Travel) // http://localhost:3001/Schedules/DeleteSchedule/id
Router.get('/', Schedule_Travel.GetAllSchedule_Travel)


export default Router