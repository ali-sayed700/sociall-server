const asyncHandler = require("express-async-handler");

const BlockModel = require("../models/Block.Model");
const ApiError = require("../utilities/ApiError");
const UserModel = require("../models/User.Model");





// Middleware to check if user is blocked
// exports.checkBlocked = (req, res, next) => {

//   next();
// }


exports.BlockUser = 
asyncHandler(async (req, res ,next) => {
  const {userId} = req.body
    let block = await BlockModel.findOne({ user:req.user._id });

    if(!block) {
        block = await BlockModel.create({
            user: req.user._id,
  blockedUser:[{userId:userId ,blocked:true}]
            
          });
    }else {
        const BlockIndex = block.blockedUser.findIndex(
            (id) => id.userId.toString() === userId 
          );

          if (BlockIndex > -1) {
            const idBlock = block.blockedUser[BlockIndex];
            // itemCart.quantity += 1;
            block.blockedUser[BlockIndex] = idBlock;
           
            //  next(new ApiError(`you blocked user`, 404));
            // console.log("you blocked user");
          } else {
            // prodcut not exist in cart , push to cartitem in arr
         block.blockedUser.push({ userId: userId, blocked:true });
        }
    }

  await UserModel.findByIdAndUpdate(req.user._id,{$pull:{followers:userId}},{new:true})
  await UserModel.findByIdAndUpdate(userId,{$pull:{following:req.user._id}},{new:true})
    await block.save();
   
    res.status(201).json({
        status: "success",
        message: "you blocked user successfully ",
        data: block,
      });
    
  });



    exports.GetBlockUser = 
  asyncHandler(async (req, res ,next) => {
    const block = await BlockModel.findOne({ user: req.user._id });

    if (!block) {
      return next(new ApiError(`there is no block user`, 404));
    }
    res.status(200).json({
      status: "success",
      numOfBlock: block.blockedUser.length,
      data: block.blockedUser,
    });

  });
  


  exports.UnBlockUser = 
  asyncHandler(async (req, res ,next) => {
  const {userId} = req.body

    const block = await BlockModel.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { blockedUser: { userId: userId } } },
        { new: true }
      );
    
    
      await block.save();
      res.status(201).json({
        status: "success",
        message:"User unblocked successfully ",
        data: block,
      });

  });




 


