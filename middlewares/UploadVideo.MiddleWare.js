const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../utilities/ApiError");

const multerOptions = () => {
  const multerStorage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "uploads/posts");
    },
    filename: function (req, file, cb) {
 
   
      if (file.fieldname.includes("image")) {
        const ext = file.mimetype.split("/")[1];
        const filename = `post-${uuidv4()}-${Date.now()}.${ext}`;
        cb(null, filename);
      }
      if (file.fieldname.includes("video")) {
        // const ext = file.mimetype.split("/")[1];
        const filename = `post-${uuidv4()}-${Date.now()}.x-mastroka`;
        cb(null, filename);
      }
 
    },

   
  });

  const multerFilter = function (req, file, cb) {
 
    if (file.fieldname.includes("image")) {
      cb(null, true);
    } else if (file.fieldname.includes("video")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images & video allowed", 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload;
};

// exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
// exports.uploadSingleCovImage = (fieldName) => multerOptions().single(fieldName);

exports.UploadMixOfVideo = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
