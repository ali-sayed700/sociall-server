const { check, body } = require("express-validator");
const slugify = require("slugify");

const ValidatorMiddleWare = require("../../middlewares/Validation.MiddleWare");
// const CateModel = require("../../models/Post.Model");


exports.GetPostValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];

exports.CreatePostValidator = [
  check("desc")
    // .notEmpty()
    // .withMessage(" must post require")
    .custom((val, { req }) => {
    
    if(val !== undefined){
  const splitArr = val.split(" ");

  const str = splitArr[0];

  if (str.includes("#") && str.length > 1) {
    req.body.slug = `${str}`;
    return true;
  }
}
return true;
    }),
   
    check("image").optional(),
    check("video").optional(),

 

  ValidatorMiddleWare,
];

exports.UpdatePostValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  ValidatorMiddleWare,
];
exports.DeletePostValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];