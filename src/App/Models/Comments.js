import { v2 as cloudinary } from 'cloudinary';
import { ObjectId } from 'mongodb';
const NAME_COLLECTION = "Comments"
class Comments {
    constructor(_id, userId, tourId, Image, content, idRating, likes = [], dislikes = [], Created_At, isDeleted = false) {
        this._id = _id
        this.userId = userId
        this.tourId = tourId
        this.Image = Image
        this.content = content
        this.idRating = idRating
        this.likes = likes
        this.dislikes = dislikes
        this.Created_At = Created_At
        this.isDeleted = isDeleted
    }

    static async getAll(db, id) {
        try {
            const result = await db.collection(NAME_COLLECTION)
                .find({ tourId: id })
                .toArray()
            return result
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }

   

    static async getAllWithDetails(db) {
        try {
            const result = await db.collection(NAME_COLLECTION)
                .find({ })
                .toArray()
            return result
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }

    static async remoteComment(db, id) {

        try {
         
            
            const findIsDeleted = await db.collection(NAME_COLLECTION).findOne({ _id: new ObjectId(id) });

            if (!findIsDeleted) {
                throw new Error("Document not found");
            }

            let Result_Update;


            if (findIsDeleted.isDeleted) {
                console.log("is deleted delete",findIsDeleted.isDeleted);
                
                // Khôi phục nếu isDeleted là true
                await db.collection(NAME_COLLECTION).updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { isDeleted: false } }
                );
                Result_Update =  await db.collection(NAME_COLLECTION).findOne({ _id: new ObjectId(id) });
                console.log("Document restored");
            } else {
               
                // Đánh dấu là đã xóa nếu isDeleted là false
                 await db.collection(NAME_COLLECTION).updateOne(
                    { _id: new ObjectId(id)},
                    { $set: { isDeleted : true } }
                );
                Result_Update =  await db.collection(NAME_COLLECTION).findOne({ _id: new ObjectId(id) });
                console.log(findIsDeleted.isDeleted);
            }

            return Result_Update;
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    async Create(db) {
        try {
            const Create_News = db.collection(NAME_COLLECTION).insertOne(this)
            return Create_News ? true : false
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }

    static async toggleLikeComment(db, commentId, userId) {
        try {
            console.log(commentId, userId);

            const comment = await db.collection(NAME_COLLECTION).findOne({ _id: new ObjectId(commentId) });
            console.log(comment);

            if (comment) {
                const userIndex = comment.likes.indexOf(userId);
                const dislikeIndex = comment.dislikes.indexOf(userId);

                if (userIndex === -1) {
                    // Nếu userId chưa có trong likes, thêm vào
                    comment.likes.push(userId);
                    // Nếu userId có trong dislikes, xóa khỏi đó
                    if (dislikeIndex !== -1) {
                        comment.dislikes.splice(dislikeIndex, 1);
                    }
                } else {
                    // Nếu userId đã có trong likes, xóa khỏi đó
                    comment.likes.splice(userIndex, 1);
                }

                await db.collection(NAME_COLLECTION).updateOne(
                    { _id: new ObjectId(commentId) },
                    { $set: { likes: comment.likes, dislikes: comment.dislikes } }
                );
                return comment;
            } else {
                throw new Error('Comment not found');
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    static async toggleDislikeComment(db, commentId, userId) {
        try {
            const comment = await db.collection(NAME_COLLECTION).findOne({ _id: new ObjectId(commentId) });

            if (comment) {
                const userIndex = comment.dislikes.indexOf(userId);
                const likeIndex = comment.likes.indexOf(userId);

                if (userIndex === -1) {
                    // Nếu userId chưa có trong dislikes, thêm vào
                    comment.dislikes.push(userId);
                    // Nếu userId có trong likes, xóa khỏi đó
                    if (likeIndex !== -1) {
                        comment.likes.splice(likeIndex, 1);
                    }
                } else {
                    // Nếu userId đã có trong dislikes, xóa khỏi đó
                    comment.dislikes.splice(userIndex, 1);
                }

                await db.collection(NAME_COLLECTION).updateOne(
                    { _id: new ObjectId(commentId) },
                    { $set: { dislikes: comment.dislikes, likes: comment.likes } }
                );

                return comment;
            } else {
                throw new Error('Comment not found');
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async Update(db, id) {
        try {
            const Update = db.collection(NAME_COLLECTION)
                .updateOne({ _id: id }, {
                    $set: {
                        Name: this.Name,
                        Title: this.Title,
                        Content: this.Content,
                        Image: this.Image,
                        Cretate_At: this.Cretate_At
                    }
                })
            return Update ? true : false
        } catch (error) {

        }
    }
    static async Delete(db, id) {
        try {
            let filenameRm
            const Data_ImageRm = await db.collection(NAME_COLLECTION).find({ _id: id }).toArray()
            if (Data_ImageRm) {
                const Delete = await db.collection(NAME_COLLECTION).deleteOne({ _id: id })
                if (Delete) {
                    Data_ImageRm.map(data_new => {
                        filenameRm = data_new.Image
                    })
                    for (let i = 0; i < filenameRm.length; i++) {
                        cloudinary.api.delete_resources(filenameRm[i].filename, (error, result) => {
                            console.log(result);
                        })
                    }
                }
                return Delete ? true : false
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
export default Comments