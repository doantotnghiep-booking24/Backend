import express from 'express'
import Ticket_Controller from '../App/Controllers/Ticket_Controller.js'
const Router = express.Router()
Router.get('/GetAllTicket',Ticket_Controller.GetAllTicket)
Router.post('/Payment',Ticket_Controller.Payment)
Router.post('/Callback',Ticket_Controller.Callback)
Router.post('/TicketStatus/:app_trans_id',Ticket_Controller.TicketStatus)
// Router.post('/CreateTicket',Ticket_Controller.CreateTicket)
// Router.post('/UpdateService/:id',Service_Controller.UpdateService)
// Router.post('/DeleteService/:id',Service_Controller.DeleteService)
Router.get('/',Ticket_Controller.GetAllTicket)


export default Router