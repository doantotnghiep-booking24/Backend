import express from 'express'
import TimeSchedules from '../App/Controllers/TimeSchedule.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
const Router = express.Router()
Router.get('/GetTimeSchedules', TimeSchedules.GetAllTimeSchedule) // http://localhost:3001/TimeSchedules/getTimeSchedules
Router.post('/CreateTimeSchedules', TimeSchedules.CreateTimeSchedule) // http://localhost:3001/TimeSchedules/CreateTimeSchedules
Router.post('/UpdateTimeSchedules/:id', TimeSchedules.UpdateTimeSchedule) // http://localhost:3001/TimeSchedules/UpdateTimeSchedules/66a46a2852a8d1dbe7a70291
Router.post('/DeleteTimeSchedules/:id', TimeSchedules.DeleteTimeSchedule) // http://localhost:3001/TimeSchedules/DeleteTimeSchedules/66a46a2852a8d1dbe7a70291
Router.get('/', TimeSchedules.GetAllTimeSchedule)
export default Router