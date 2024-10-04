import Tour from './Tour.Route.js'
import User from './User.Route.js'
import Categories from './Categories.Route.js'
import Service from './Service.Route.js'
import Vehicle from './Vehicle.Route.js'
import Featured_Location from './Featured_Location.js'
import News from './News.Route.js'
const Route = (app) => {
    app.use('/V1/Tours', Tour)
    app.use('/V2/Category', Categories)
    app.use('/V2/Featured_Location',Featured_Location)
    app.use('/Services',Service)
    app.use('/Vehicles',Vehicle)
    app.use('/User', User)
    app.use('/News',News)
    app.use('/', Tour)
}
export default Route