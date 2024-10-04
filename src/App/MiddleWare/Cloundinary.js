import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import "dotenv/config.js";
cloudinary.config({
  cloud_name: "dlfiavsma",
  api_key: "341995131699345",
  api_secret: "gyt46q33R6Fk0U2qVipMV2whsog"
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params : {
    folder : 'StorageImages'
  }
});

const uploadCloud = multer({ storage });

export default uploadCloud;
