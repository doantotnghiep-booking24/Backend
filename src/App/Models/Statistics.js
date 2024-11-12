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
}

export default Statistics;
