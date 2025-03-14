import Tour from './Tour.Route.js'
import User from './User.Route.js'
import Categories from './Categories.Route.js'
import Service from './Service.Route.js'
import Schedule from './Schedule_Travel.Route.js'
import Featured_Location from './Featured_Location.js'
import News from './News.Route.js'
import Voucher from './Voucher.Route.js'
import TypeTour from './TypeTour.Route.js'
import Ticket from './Ticket.Route.js'
import Review from "./Reviews.Route.js"
import Custommer from './Custommer.Route.js'
import Hotel from './Hotel.Route.js'
import TourFavourite from './TourFavourite.Route.js'
import Statistics from './Statistic.Route.js'
import Chat from './Chat.Route.js'
import TimeSchedules from './TimeSchedule.Route.js'
const Route = (app) => {
    app.use('/V1/Review', Review)
    app.use('/V1/Tours', Tour)
    app.use('/V2/Category', Categories)
    app.use('/V2/Featured_Location',Featured_Location)
    app.use('/V2/TypeTour',TypeTour)
    app.use('/Services',Service)
    app.use('/TourFavourites',TourFavourite)
    app.use('/Custommer',Custommer)
    app.use('/Schedules',Schedule)
    app.use('/Vouchers',Voucher)
    app.use('/Ticket',Ticket)
    app.use('/User', User)
    app.use('/News', News)
    app.use('/Hotel',Hotel)
    app.use('/Statistics',Statistics)
    app.use('/Chat', Chat)
    app.use('/TimeSchedules', TimeSchedules)
    app.use('/', Tour)
}
export default Route
