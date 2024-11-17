import { ObjectId } from 'mongodb';
class Statistics {
  static async getTotalTours(db) {
    return db.collection('Tours').countDocuments();
  }

  static async getTotalTickets(db) {
    return db.collection('Tickets').countDocuments({ isCancle: false });
  }

  static async getTotalNews(db) {
    return db.collection('News').countDocuments();
  }

  static async getTickets(db) {
    return db.collection('Tickets')
      .aggregate([
        { $match: { isCancle: false } },
        {
          $project: {
            _id: 1,
            Total_price: 1,
            Created_at_Booking: 1,
          },
        },
        { $sort: { Created_at_Booking: 1 } },
      ])
      .toArray();
  }

  static async getTotalRevenue(db) {
    return db.collection('Tickets')
      .aggregate([
        { $match: { isCancle: false } },
        {
          $project: {
            Created_at_Booking: { $toDate: '$Created_at_Booking' },
            Total_price: 1,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$Created_at_Booking' } },
            totalRevenuePerDay: { $sum: '$Total_price' },
          },
        },
        { $sort: { '_id': 1 } },
      ])
      .toArray();
  }

  static async getTotalAmountFromTickets(db) {
    const result = await db.collection('Tickets')
      .aggregate([
        { $match: { isCancle: false } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$Total_price' },
          },
        },
      ])
      .toArray();
    return result[0] ? result[0].totalAmount : 0;
  }
  static async getTopRatedTours(db) {
    const topRatedTours = await db.collection('Tours')
      .find({ totalReview: { $gte: 4, $lte: 5 } })
      .sort({ totalReview: -1 })
      .toArray();

    const count = topRatedTours.length;

    return {
      topRatedTours,
      count,
    };
  }
  static async getTopToursByBookings(db) {
    return db.collection('Tickets')
      .aggregate([
        { $match: { isCancle: false } },
        { $group: { _id: { $toObjectId: '$id_tour' }, bookingCount: { $sum: 1 } } }, 
        { $sort: { bookingCount: -1 } },
        { $limit: 3 },
        {
          $lookup: {
            from: 'Tours',
            localField: '_id',
            foreignField: '_id',
            as: 'tourDetails'
          }
        },
        { $unwind: '$tourDetails' },
        {
          $project: {
            _id: 0,
            tourId: '$_id',
            Name_Tour: '$tourDetails.Name_Tour',
            Image_Tour: '$tourDetails.Image_Tour',
            bookingCount: 1
          }
        }
      ])
      .toArray();
  }
  
}

export default Statistics;
