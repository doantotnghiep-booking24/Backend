import express from 'express'
import Ticket_Controller from '../App/Controllers/Ticket_Controller.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
const Router = express.Router()
// ZALOPAY
Router.get('/GetAllTicket', AuthUser(["Admin", "User"]), Ticket_Controller.GetAllTicket)
Router.post('/PaymentZalopay', AuthUser(["Admin", "User"]), Ticket_Controller.PaymentWithZalopay)
Router.post('/Callback', AuthUser(["Admin", "User"]), Ticket_Controller.Callback)
Router.post('/TicketStatus/:app_trans_id', AuthUser(["Admin", "User"]), Ticket_Controller.TicketStatus)
Router.post('/CreateTicket', AuthUser(["Admin", "User"]), Ticket_Controller.CreateTicket)
Router.post('/FindTicket/:id', AuthUser(["Admin", "User"]), Ticket_Controller.FindTicket)
// VNPAY
Router.post('/create_payment_url', AuthUser(["Admin", "User"]), Ticket_Controller.create_payment_url)
Router.get('/vnpay_return', AuthUser(["Admin", "User"]), Ticket_Controller.vnpay_return)
// PAYMENT DIRECT
Router.post('/Direct_PaymentTicket', AuthUser(["Admin", "User"]), Ticket_Controller.Direct_PaymentTicket)

// Router.get('/vnpay_ipn',Ticket_Controller.vnpay_ipn)
// Router.post('/UpdateService/:id',Service_Controller.UpdateService)
// Router.post('/DeleteService/:id',Service_Controller.DeleteService)
Router.get('/', Ticket_Controller.GetAllTicket)


export default Router