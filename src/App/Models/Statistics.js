import { ObjectId } from "mongodb";
class Statistics {
  static async getTotalTours(db) {
    return db.collection("Tours").countDocuments();
  }

  static async getTotalTickets(db) {
    return db.collection("Tickets").countDocuments({ isRequestCancel: false });
  }

  static async getTotalNews(db) {
    return db.collection("News").countDocuments();
  }

  static async getTickets(db) {
    return db
      .collection("Tickets")
      .aggregate([
        { $match: { isRequestCancel: false } },
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
    return db
      .collection("Tickets")
      .aggregate([
        { $match: { isRequestCancel: false } },
        {
          $project: {
            Created_at_Booking: { $toDate: "$Created_at_Booking" },
            Total_price: 1,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$Created_at_Booking",
              },
            },
            totalRevenuePerDay: { $sum: "$Total_price" },
            totalTicketsPerDay: { $sum: 1 },
          },
        },

        { $sort: { _id: 1 } },
      ])
      .toArray();
  }
  static async getTotalAmountFromTickets(db) {
    const result = await db
      .collection("Tickets")
      .aggregate([
        { $match: { isRequestCancel: false } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$Total_price" },
          },
        },
      ])
      .toArray();
    return result[0] ? result[0].totalAmount : 0;
  }
  static async getTopRatedTours(db) {
    const topRatedTours = await db
      .collection("Tours")
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
    return db
      .collection("Tickets")
      .aggregate([
        { $match: { isRequestCancel: false } },
        {
          $group: {
            _id: { $toObjectId: "$id_tour" },
            bookingCount: { $sum: 1 },
          },
        },
        { $sort: { bookingCount: -1 } },
        { $limit: 3 },
        {
          $lookup: {
            from: "Tours",
            localField: "_id",
            foreignField: "_id",
            as: "tourDetails",
          },
        },
        { $unwind: "$tourDetails" },
        {
          $project: {
            _id: 0,
            tourId: "$_id",
            Name_Tour: "$tourDetails.Name_Tour",
            Image_Tour: "$tourDetails.Image_Tour",
            bookingCount: 1,
          },
        },
      ])
      .toArray();
  }

  // lấy danh sách người dùng đã đặt tour
  static async getUsersBookedTour(db) {
    return db
      .collection("Tickets")
      .aggregate([
        { $match: { isRequestCancel: false } },
        {
          $group: {
            _id: { $toObjectId: "$id_user" },
            totalBookings: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        {
          $project: {
            _id: 0,
            userId: "$_id",
            totalBookings: 1,
            username: "$userDetails.Name",
            email: "$userDetails.Email",
            photoUrl: "$userDetails.photoUrl",
          },
        },
      ])
      .toArray();
  }
  static async getUsersByBookingDate(db) {
    return db
      .collection("Tickets")
      .aggregate([
        { $match: { isRequestCancel: false } },
        {
          $project: {
            bookingDate: { $toDate: "$Created_at_Booking" },
            id_user: 1,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" },
            },
            users: { $addToSet: { $toObjectId: "$id_user" } },
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "users",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $project: {
            date: "$_id",
            userDetails: {
              username: "$userDetails.Name",
              email: "$userDetails.Email",
              photoUrl: "$userDetails.photoUrl",
            },
          },
        },
        { $sort: { date: 1 } },
      ])
      .toArray();
  }

  static async getToursByBookingDate(db) {
    return db
      .collection("Tickets")
      .aggregate([
        { $match: { isRequestCancel: false } },
        {
          $project: {
            bookingDate: { $toDate: "$Created_at_Booking" },
            id_tour: { $toObjectId: "$id_tour" },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" },
            },
            tours: { $addToSet: "$id_tour" },
          },
        },
        {
          $lookup: {
            from: "Tours",
            localField: "tours",
            foreignField: "_id",
            as: "tourDetails",
          },
        },
        {
          $project: {
            date: "$_id",
            tourDetails: {
              Name_Tour: "$tourDetails.Name_Tour",
              Image_Tour: "$tourDetails.Image_Tour",
            },
          },
        },
        { $sort: { date: 1 } },
      ])
      .toArray();
  }
}

export default Statistics;
