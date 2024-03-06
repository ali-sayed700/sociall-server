const { check, body } = require("express-validator");
const slugify = require("slugify");

const ValidatorMiddleWare = require("../../middlewares/Validation.MiddleWare");
// const CateModel = require("../../models/Post.Model");


exports.GetPostValidator = [
  check("id").isMongoId().withMessage("Not a valid id"),
  ValidatorMiddleWare,
];

// exports.CreateUserValidator = [
//   check("desc")
//     // .notEmpty()
//     // .withMessage(" must post require")
//     .custom((val, { req }) => {
//       console.log(val)
//       //   const splitArr = val.split(" ")
//       // console.log(splitArr);

//       //   const str = splitArr[0]
      
//       //   if(str.includes("#") && str.length  > 1 ) {

//       //       req.body.slug = `${str}`;
//       //       return true
//       //   }
//         return true
//     }),


 

//   ValidatorMiddleWare,
// ];

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