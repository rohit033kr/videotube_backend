import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy,
        sortType,
        userId
    } = req.query;

    const pipeline = [];

    if (query) {
        pipeline.push({
            $match: {
                title: {
                    $regex: query,
                    $options: "i"
                }
            }
        });
    }

    if (userId && isValidObjectId(userId)) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        });
    }

    pipeline.push({
        $sort: {
            [sortBy || "createdAt"]: sortType === "asc" ? 1 : -1
        }
    });
    pipeline.push({
        $match: {
            isPublished: true
        }
    });

    const aggregate = Video.aggregate(pipeline);

    const options = {
        page: Number(page),
        limit: Number(limit)
    };

    const videos = await Video.aggregatePaginate(aggregate, options);

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const uploadedVideo = await uploadOnCloudinary(videoLocalPath);

    if (!uploadedVideo) {
        throw new ApiError(500, "Failed to upload video");
    }

    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!uploadedThumbnail) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    const video = await Video.create({
        title,
        description,
        videoFile: {
            url: uploadedVideo.secure_url,
            public_id: uploadedVideo.public_id
        },
        thumbnail: {
            url: uploadedThumbnail.secure_url,
            public_id: uploadedThumbnail.public_id
        },
        duration: uploadedVideo.duration,
        owner: req.user._id,
        isPublished: true
    });

    if (!video) {
        throw new ApiError(500, "Failed to publish video");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            video,
            "Video published successfully"
        )
    );
});

const getVideoById = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: {
                views: 1
            }
        },
        {
            new: true
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Video fetched successfully"
        )
    );
});

const updateVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this video"
        );
    }

    const { title, description } = req.body;

    let thumbnailUrl = video.thumbnail;

    if (req.file?.path) {

        const uploadedThumbnail =
            await uploadOnCloudinary(req.file.path);

        if (!uploadedThumbnail) {
            throw new ApiError(
                500,
                "Failed to upload thumbnail"
            );
        }

        thumbnailUrl = uploadedThumbnail.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title ?? video.title,
                description: description ?? video.description,
                thumbnail: thumbnailUrl
            }
        },
        {
            new: true
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedVideo,
            "Video updated successfully"
        )
    );
});

const deleteVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to delete this video"
        );
    }

    // Optional:
    // await deleteFromCloudinary(video.videoFile);
    // await deleteFromCloudinary(video.thumbnail);

    await deleteFromCloudinary(
        video.videoFile.public_id,
        "video"
    );

    await deleteFromCloudinary(
        video.thumbnail.public_id,
        "image"
    );

    await video.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Video deleted successfully"
        )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Check if video exists
    const existingVideo = await Video.findById(videoId);

    if (!existingVideo) {
        throw new ApiError(404, "Video not found");
    }

    // Check ownership
    if (existingVideo.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this video"
        );
    }

    // Toggle publish status
    const video = await Video.findByIdAndUpdate(
        videoId,
        [
            {
                $set: {
                    isPublished: {
                        $not: "$isPublished"
                    }
                }
            }
        ],
        {
            new: true
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            `Video ${
                video.isPublished ? "published" : "unpublished"
            } successfully`
        )
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}