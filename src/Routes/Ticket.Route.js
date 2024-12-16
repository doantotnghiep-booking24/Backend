import express from 'express'
import Ticket_Controller from '../App/Controllers/Ticket_Controller.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
const Router = express.Router()
Router.get('/GetAllTicket',Ticket_Controller.GetAllTicket)
Router.post('/Update_StatusTickets',Ticket_Controller.Update_StatusTickets)
Router.post('/Update_StatusCancelTicketsByClient/:id',Ticket_Controller.Update_StatusCancelTicketsByClient)
Router.post('/ConfirmCancleTicket/:id',Ticket_Controller.HandleConfirmCancleTicket)
Router.post('/DeleteTicket/:id',Ticket_Controller.HandleDeleteTicket)

// ZALOPAY
Router.post('/PaymentZalopay',Ticket_Controller.PaymentWithZalopay)
Router.post('/Callback',Ticket_Controller.Callback)
Router.post('/TicketStatus/:app_trans_id',Ticket_Controller.TicketStatus)
Router.post('/CreateTicket',Ticket_Controller.CreateTicket)
Router.post('/FindTicket/:id',Ticket_Controller.FindTicket)
Router.post('/Refund_PaymenZalo',Ticket_Controller.Refund_PaymenZalo)
Router.post('/queryRefunc',Ticket_Controller.queryRefunc)
// VNPAY
Router.post('/create_payment_url',Ticket_Controller.create_payment_url)
Router.get('/vnpay_return',Ticket_Controller.vnpay_return)
Router.post('/refund',Ticket_Controller.Vnpay_refund)
Router.post('/Vnpay_Query',Ticket_Controller.Vnpay_Query)
// PAYMENT DIRECT
Router.post('/Direct_PaymentTicket', AuthUser(["Admin", "User", "Staff"]), Ticket_Controller.Direct_PaymentTicket)

// Router.get('/vnpay_ipn',Ticket_Controller.vnpay_ipn)
// Router.post('/UpdateService/:id',Service_Controller.UpdateService)
// Router.post('/DeleteService/:id',Service_Controller.DeleteService)
Router.get('/', Ticket_Controller.GetAllTicket)


export default Router