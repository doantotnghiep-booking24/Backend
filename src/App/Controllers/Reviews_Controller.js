import Connection from '../../Config/db/index.js';
import Reviews from "../Models/Review.js";
import Comments from '../Models/Comments.js';
import User from '../Models/User.js';
import Tour from '../Models/Tour.js';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import { io } from '../../index.js';
class ReviewsController {
    async GetAllReviews(req, res, next) {
        const { id } = req.params;
        try {
            const db = await Connection.connect();

            const AllReviews = await Reviews.getAll(db, id);
            const AllComments = await Comments.getAll(db, id);
            const detailTour = await Tour.Detail(db, new ObjectId(id));

            const tourIds = detailTour.map(tour => tour._id);

            // Lọc các đánh giá dựa trên tourId
            const totalReview = AllReviews.filter(review =>
                tourIds.some(tourId => new ObjectId(review.tourId).equals(tourId))
            );

            // Tính toán rating tổng hợp
            const totalRatings = totalReview.reduce((acc, review) => {
                const rating = Number(review.rating);
                acc.total += rating;
                acc.count += 1;
                acc[rating] = (acc[rating] || 0) + 1;
                return acc;
            }, { total: 0, count: 0 });

            const weightedRating = (totalRatings.total / totalRatings.count) || 0; // Tránh chia cho 0
            const roundedRating = Math.round(weightedRating * 100) / 100;

            await Tour.UpdateTourTotalRating(db, new ObjectId(id), { totalReview: roundedRating });


            const combinedResults = await Promise.all(AllReviews.map(async (review) => {
                const commentsForReview = AllComments.filter(comment => comment.idRating.toString() === review._id.toString());
                const firstComment = commentsForReview.length > 0 ? commentsForReview[0] : {};

                // Lấy thông tin user dựa trên userId của review
                const user = await User.GetUserById(db, new ObjectId(review.userId));

                return {
                    _id: firstComment._id,
                    userName: user ? user.Name : "Anonymous",  // Thêm thông tin tên user
                    userId: review.userId,
                    tourId: review.tourId,
                    photoUrl: user?.photoUrl,
                    rating: Number(review.rating),
                    likes: firstComment.likes,
                    dislikes: firstComment.dislikes,
                    Image: commentsForReview.map(comment => comment.Image).flat(),
                    content: commentsForReview.length > 0 ? commentsForReview[0].content : null,
                    Create_At: review.Created_At,
                };
            }));

            combinedResults.sort((a, b) => new Date(b.Create_At) - new Date(a.Create_At));

            if (combinedResults.length > 0) {

                return res.status(200).json({ data: combinedResults }); // Gửi kết quả đã ghép với user name
            } else {
                return res.status(200).json({ message: "No comments found" });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: "Internal Server Error" });
        }
    }


    async CreateNew(req, res, next) {
        let Data_Image = [];
        let Data_rm = []
        let filesData = req.files; // Nhận dữ liệu ảnh từ request
        let { tourId, userId, rating, content, likes, dislikes, Image } = req.body; // Nhận các tham số từ request body
        rating = parseInt(rating)
        likes = JSON.parse(likes); // Parse lại từ chuỗi thành mảng
        dislikes = JSON.parse(dislikes); // Parse lại từ chuỗi thành mảng
        try {
            Connection.connect().then(async (db) => {
                const Create_At = new Date();

                for (let i = 0; i < filesData.length; i++) {
                    Data_Image.push(filesData[i])
                    Data_rm.push(filesData[i].filename)
                }
                Image = Data_Image
                // Tạo đối tượng mới từ dữ liệu nhận được cho Reviews
                const newReview = new Reviews(undefined, userId, tourId, rating, Create_At);
                const reviewResult = await newReview.Create(db); // Gọi phương thức Create và truyền db

                const idRating = await reviewResult.insertedId.toString()


                // Tạo đối tượng mới từ dữ liệu nhận được cho Comments
                const newComment = new Comments(undefined, userId, tourId, Image, content, idRating, likes, dislikes, Create_At);
                const commentResult = await newComment.Create(db); // Gọi phương thức Create và truyền db

                // Kiểm tra xem việc tạo mới có thành công không
                if (!reviewResult || !commentResult || !userId || !tourId || !rating || !content || Image.length < 0) {
                    // Nếu không thành công, xóa ảnh khỏi Cloudinary
                    if (filesData) {
                        for (let i = 0; i < filesData.length; i++) {
                            cloudinary.api.delete_resources(filesData[i].filename, (error, result) => {
                                console.log(result, error);
                            })
                        }
                    }
                    return res.status(400).send({ message: "You need to fill in complete information" });
                }

                // Nếu thành công, trả về thông báo
                res.status(200).send({ message: 'Create Success' });
                const reviewAll = {
                    _id: newComment._id,
                    userId: newComment.userId,
                    tourId: newComment.tourId,
                    rating: Number(newReview.rating),
                    Image: newComment.Image,
                    content: newComment.content,
                    Create_At: newComment.Created_At
                }
                // Emit sự kiện cho tất cả client khi có đánh giá mới
                io.emit('newReview', reviewAll); // Gửi thông tin review mới đến tất cả client
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: "Internal Server Error" });
        }
    }


    async DeleteNew(req, res, next) {
        const { id } = req.params;
        try {
            const db = await Connection.connect();
            const DeleteNew = await Reviews.Delete(db, new ObjectId(id));
            if (DeleteNew) {
                return res.status(200).send({ message: 'Delete Success' });
            }
            return res.status(404).send({ message: 'Review not found' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: "Internal Server Error" });
        }
    }
}

export default new ReviewsController();
