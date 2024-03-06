
const multer = require("multer");

const { v4: uuidv4 } = require("uuid");

const ApiError = require("../utilities/ApiError");



const multerOptions = () => {
  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/messages");
    },
    filename: function (req, file, cb) {

      if (file.fieldname.includes("image")) {
        const ext = file.mimetype.split("/")[1];
        const filename = `message-${uuidv4()}-${Date.now()}.${ext}`;
        cb(null, filename);
      }
      if (file.fieldname.includes("video")) {

        const filename = `message-${uuidv4()}-${Date.now()}.x-mastroka`;
        cb(null, filename);
      }
    },
  });

  const multerFilter = function (req, file, cb) {

    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else if (file.mimetype.startsWith("video")) {
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



exports.UploadMixOfMessage = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);