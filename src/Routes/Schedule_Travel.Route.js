import express from 'express'
import Schedule_Travel from '../App/Controllers/Schedule_Travel_Controller.js'
const Router = express.Router()
Router.get('/GetAllSchedule',Schedule_Travel.GetAllSchedule_Travel) // http://localhost:3001/Schedules/GetAllSchedule
Router.post('/CreateSchedule',Schedule_Travel.CreateSchedule_Travel) // http://localhost:3001/Schedules/CreateSchedule
Router.post('/UpdateSchedule/:id',Schedule_Travel.UpdateSchedule_Travel) // http://localhost:3001/Schedules/UpdateSchedule/id
Router.post('/DeleteSchedule/:id',Schedule_Travel.DeleteSchedule_Travel) // http://localhost:3001/Schedules/DeleteSchedule/id
Router.get('/',Schedule_Travel.GetAllSchedule_Travel)


export default Router