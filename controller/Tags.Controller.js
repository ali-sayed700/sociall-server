const asyncHandler = require("express-async-handler");
const PostModel = require("../models/Post.Model");






exports.CreateTags = asyncHandler(async (req, res) => {

    const result = await PostModel.aggregate([

      {
        $match: {
          slug: /#\S/,
        },
      },
      {
    $group: {
     
      _id: "$slug",
      count: {
        $sum: 1
      },

      posts: { $push: "$_id" },
      users: { $addToSet: "$user" },
          
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          hashtag: "$_id",
          posts: 1,
          users: 1,
          
          
        }
      },
      { $sort : { count : -1 } },
      { $limit : 6 },
      {
        $lookup: {
            from: "users",
            localField: "user",
            foreignField: "hashtag",
            as: "userId"
        }
    },
    {
      $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "hashtag",
          as: "postArr"
      }
  }
    
      
      
    ])


  res.status(200).json({status:"success", data: result   });
});
