import Connection from '../../Config/db/index.js'
import Tour from '../Models/Tour.js';
import Comments from '../Models/Comments.js';
import User from '../Models/User.js';
import Reviews from '../Models/Review.js';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
class Tour_Controller {
    Create_Tour(req, res, next) {
        let Data_Image = []
        let Data_rm = []
        let filesData = req.files
        let After_Discount = 0
        let { id_Schedule_Travel, id_Voucher, id_Category, id_Type_Tour, Name_Tour, Price_Tour, Image_Tour, Title_Tour, Description_Tour, Start_Tour, End_Tour, total_Date } = req.body
        Connection.connect().then(async (db) => {
            try {
                for (let i = 0; i < filesData.length; i++) {
                    Data_Image.push(filesData[i])
                    Data_rm.push(filesData[i].filename)
                }
                Image_Tour = Data_Image
                const Create_Tour = new Tour(undefined, id_Schedule_Travel, id_Voucher, id_Category, id_Type_Tour, Name_Tour, parseInt(Price_Tour), After_Discount, Image_Tour, Title_Tour, Description_Tour, Start_Tour, End_Tour, total_Date, false)
                const result = await Create_Tour.CreateTour(db)
                if (!result) {
                    if (filesData) {
                        for (let i = 0; i < filesData.length; i++) {
                            cloudinary.api.delete_resources(filesData[i].filename, (error, result) => {
                                console.log(result, error)
                            })
                        }
                    }
                    return res.status(400).json({ message: 'Created Tour Failed' })
                }
                return res.status(200).json({ message: 'Created Tour Success' })
            } catch (error) {
                console.log(error)
            }
        })
    }
    GetAllTour(req, res) {
        const { page, limit } = req.query
        Connection.connect().then(async (db) => {
            try {
                const AllTour = await Tour.ShowAll(db, parseInt(page), parseInt(limit))
                // console.log(AllTour);

                if (AllTour) {
                    return res.status(200).json({ Tours: AllTour })
                } else {
                    return res.status(400).json({ Message: 'Error' })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
    GetTours_Related(req, res) {
        Connection.connect().then(async (db) => {
            try {
                const AllTour_Related = await Tour.GetTours_Related(db)
                if (AllTour_Related) {
                    return res.status(200).json({ Tours_Related: AllTour_Related })
                } else {
                    return res.status(400).json({ Message: 'Error' })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
    DeleteTour(req, res, next) {
        const { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const Delete_Tour = await Tour.Delete(db, new ObjectId(id))
                if (Delete_Tour) {
                    return res.status(200).json({ message: "Delete Success" })
                }
            } catch (error) {
                console.log(error);
                
            }
        })
    }
    UpdateTour(req, res, next) {
        const { id } = req.params
        let { id_Schedule_Travel, id_Voucher, id_Category, id_Type_Tour, Name_Tour, Price_Tour, Image_Tour, Title_Tour, Description_Tour, Start_Tour, End_Tour, total_Date } = req.body
        let Data_rm = []
        let Data_Image = []
        let Data_Path = []
        let filesData = req.files
        let count = 0
        let filenameUpd
        let After_Discount
        Connection.connect().then(async (db) => {
            try {
                const filterNews = await db.collection('Tours').find({ _id: new ObjectId(id) }).toArray()

                for (let i = 0; i < filesData.length; i++) {
                    Data_Image.push(filesData[i])
                    Data_rm.push(filesData[i].filename)
                    Data_Path.push(filesData[i].path)
                    count++
                }
                Image_Tour = Data_Image
                const Update_Tour = new Tour(undefined, id_Schedule_Travel, id_Voucher, id_Category, id_Type_Tour, Name_Tour, parseInt(Price_Tour), After_Discount, Image_Tour, Title_Tour, Description_Tour, Start_Tour, End_Tour, total_Date)
                const result = await Update_Tour.UpdateTour(db, new ObjectId(id))
                if (Update_Tour) {
                    if (!result) {
                        if (filesData) {
                            cloudinary.api.delete_resources(Data_rm[count], (error, result) => {
                                console.log('error', error);
                                console.log('result', result);
                            })
                        }
                        return res.status(400).json({ message: 'Update Failed' })
                    } else {
                        filterNews.map(data_new => {
                            filenameUpd = data_new.Image_Tour

                        })


                        for (let i = 0; i < filenameUpd.length; i++) {
                            cloudinary.api.delete_resources(filenameUpd[i].filename, (error, result) => {
                                console.log('error', error);
                                console.log('result', result);
                            })
                        }
                        return res.status(200).json({ message: 'Update Success' })
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
    SearchTour(req, res, next) {
        const { NameSearch, page, limit, PriceSearch } = req.query
        Connection.connect().then(async (db) => {
            try {
                const resultSearch = await Tour.Search(db, NameSearch, parseInt(PriceSearch), parseInt(page), parseInt(limit))
                if (resultSearch) return res.status(200).json({ search: resultSearch })
            } catch (error) {
                console.log(err)
            }
        })
    }
    DetailTour(req, res, next) {
        const { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const detailTour = await Tour.Detail(db, new ObjectId(id))
                if (detailTour) return res.status(200).json({ detailTour: detailTour })
            } catch (error) {
                console.log(error);
            }
        })
    }

    async getAllComments(req, res, next) {
        const { id } = req.params;


        try {
            const db = await Connection.connect();

            const AllReviews = await Reviews.getAll(db, id);
            const AllComments = await Comments.getAll(db, id);
            const detailTour = await Tour.Detail(db, new ObjectId(id));

            const tourIds = detailTour.map(tour => tour._id);

            // Lọc các đánh giá có rating là 5 sao
            const fiveStarReviews = AllReviews.filter(
                review => Number(review.rating) === 5 && tourIds.some(tourId => new ObjectId(review.tourId).equals(tourId))
            );

            // Ghép đánh giá và bình luận tương ứng
            const combinedResults = await Promise.all(fiveStarReviews.map(async (review) => {
                const commentsForReview = AllComments.filter(comment => comment.idRating.toString() === review._id.toString());
                const firstComment = commentsForReview.length > 0 ? commentsForReview[0] : {};

                // Lấy thông tin user
                const user = await User.GetUserById(db, new ObjectId(review.userId));

                return {
                    _id: firstComment._id,
                    userId: review.userId,
                    userName: user ? user.Name : "Unknown User",
                    photoUrl: user ? user.photoUrl : "",
                    tourId: review.tourId,
                    rating: Number(review.rating),
                    likes: firstComment.likes,
                    dislikes: firstComment.dislikes,
                    Image: commentsForReview.map(comment => comment.Image).flat(),
                    content: commentsForReview.length > 0 ? commentsForReview[0].content : null,
                    Create_At: review.Created_At,
                };
            }));

            // Trả về kết quả
            if (combinedResults.length > 0) {


                return res.status(200).json({ data: combinedResults }); // Gửi kết quả đã ghép
            } else {
                return res.status(200).json({ message: "No 5-star comments" });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: "Internal Server Error" });
        }
    }

    async RemoveTour(req, res) {
        const { id } = req.params

        Connection.connect().then(async (db) => {
            try {
                const Remove_Tour = await Tour.Remove(db, new ObjectId(id))
                if (Remove_Tour) {
                    return res.status(200).json({ message: "Remove Success" })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }



}
export default new Tour_Controller()
