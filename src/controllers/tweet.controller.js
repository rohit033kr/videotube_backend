import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {

    const { content } = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    });

    if (!tweet) {
        throw new ApiError(500, "Failed to create tweet");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            tweet,
            "Tweet created successfully"
        )
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params;

    if(!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const user = await User.findById(userId);
    if(!user) {
        throw new ApiError(404, "user not found");
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId) 
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
           $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: {
                    _id: "$owner._id",
                    username: "$owner.username",
                    fullname: "$owner.fullname",
                    avatar: "$owner.avatar"
                }
           } 
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);
    return res.status(200).json(
        new ApiResponse(
            200,
            tweets,
            "Tweets fetched successfully"
        )
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const {content} = req.body;

    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    if(!content || !content.trim()) {
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.findById(tweetId);
    if(!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if(tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you are not authorized to update this tweet");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content.trim()
            }
        },
        {
            new: true
        }
    );

//     const updatedTweet = await Tweet.findOneAndUpdate(
//     {
//         _id: tweetId,
//         owner: req.user._id
//     },
//     {
//         $set: {
//             content: content.trim()
//         }
//     },
//     {
//         new: true
//     }
// );

// if (!updatedTweet) {
//     throw new ApiError(
//         404,
//         "Tweet not found or you are not authorized"
//     );
// }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedTweet,
            "Tweet updated successfully"
        )
    );
});

const deleteTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to delete this tweet"
        );
    }

    await tweet.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Tweet deleted successfully"
        )
    );
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}