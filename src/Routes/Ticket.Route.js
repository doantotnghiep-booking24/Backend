import express from 'express'
import Ticket_Controller from '../App/Controllers/Ticket_Controller.js'
const Router = express.Router()
Router.get('/GetAllTicket',Ticket_Controller.GetAllTicket)
Router.post('/Update_StatusTickets',Ticket_Controller.Update_StatusTickets)

// ZALOPAY
Router.post('/PaymentZalopay',Ticket_Controller.PaymentWithZalopay)
Router.post('/Callback',Ticket_Controller.Callback)
Router.post('/TicketStatus/:app_trans_id',Ticket_Controller.TicketStatus)
Router.post('/CreateTicket',Ticket_Controller.CreateTicket)
Router.post('/FindTicket/:id',Ticket_Controller.FindTicket)
Router.post('/Refund_PaymenZalo',Ticket_Controller.Refund_PaymenZalo)
// VNPAY
Router.post('/create_payment_url',Ticket_Controller.create_payment_url)
Router.get('/vnpay_return',Ticket_Controller.vnpay_return)
Router.post('/refund',Ticket_Controller.Vnpay_refund)
Router.post('/Vnpay_Query',Ticket_Controller.Vnpay_Query)
// PAYMENT DIRECT
Router.post('/Direct_PaymentTicket',Ticket_Controller.Direct_PaymentTicket)

// Router.get('/vnpay_ipn',Ticket_Controller.vnpay_ipn)
// Router.post('/UpdateService/:id',Service_Controller.UpdateService)
// Router.post('/DeleteService/:id',Service_Controller.DeleteService)
Router.get('/',Ticket_Controller.GetAllTicket)


export default Router