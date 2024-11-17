import Connection from '../../Config/db/index.js';
import Statistics from '../Models/Statistics.js';

class Admin_Statistics_Controller {
  static async getStatistics(req, res) {
    try {
      const db = await Connection.connect();

      const totalTours = await Statistics.getTotalTours(db);
      const totalTickets = await Statistics.getTotalTickets(db);
      const totalNews = await Statistics.getTotalNews(db);
      const tickets = await Statistics.getTickets(db);
      const totalRevenue = await Statistics.getTotalRevenue(db);
      const totalAmount = await Statistics.getTotalAmountFromTickets(db);
      const topRatedTours = await Statistics.getTopRatedTours(db);
      const topToursByBookings = await Statistics.getTopToursByBookings(db);

      res.json({
        totalTours,
        totalNews,
        totalTickets,
        tickets,
        totalRevenue,
        totalAmount,
        topRatedTours: topRatedTours.topRatedTours,
        topRatedTourCount: topRatedTours.count,   
        topToursByBookings,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi server');
    }
  }
}

export default Admin_Statistics_Controller;
