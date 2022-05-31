import mongoose from "mongoose";
import Post from "../models/post.js";
import Review from "../models/review.js";
import User from "../models/user.js";

export const getPosts = async (req, res) => {
    const { category, search, page: queryPage, sort } = req.query;

    try {
        const page = queryPage ? Number.parseInt(queryPage) : 1;
        const limit = 6;
        const startIndex = (Number(page) - 1) * limit;
        let total = await Post.countDocuments({});

        let sorting = "-postDate";

        if (sort)
            switch (sort) {
                case "rating":
                    sorting = "-rating.avg";
                    break;
                case "priceInc":
                    sorting = "price";
                    break;
                case "priceDec":
                    sorting = "-price";
                    break;
                default:
                    sorting = "-postDate";
            }

        let query;
        if (!category && !search) {
            query = await Post.find().select("title images rating description price fields").sort(sorting).limit(limit).skip(startIndex);
        } else if (category && !search) {
            query = await Post.find()
                .where("category")
                .in(category)
                .select("title images rating description price fields")
                .sort(sorting)
                .limit(limit)
                .skip(startIndex);

            total = await Post.countDocuments().where("category").in(category);
        } else if (!category && search) {
            query = await Post.find({
                title: {
                    $regex: search,
                    $options: "i",
                },
            })
                .select("title images rating description price fields")
                .sort(sorting)
                .limit(limit)
                .skip(startIndex);

            total = await Post.countDocuments({
                title: {
                    $regex: search,
                    $options: "i",
                },
            });
        } else {
            query = await Post.find({
                title: {
                    $regex: search,
                    $options: "i",
                },
            })
                .where("category")
                .in(category)
                .select("title images rating description price fields")
                .sort(sorting)
                .limit(limit)
                .skip(startIndex);

            total = await Post.countDocuments({
                title: {
                    $regex: search,
                    $options: "i",
                },
            })
                .where("category")
                .in(category);
        }
        const result = query.map((post) => {
            if (post.images) return { ...post._doc, postId: post._doc._id, previewImage: post.images[0], images: null };
            else return { ...post._doc, postId: post._doc._id, previewImage: null };
        });

        res.status(200).json({
            data: result,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
};

export const getSimilarPosts = async (req, res) => {
    const { categories, page: queryPage } = req.query;
    const { id } = req.params;

    try {
        const page = queryPage ? Number.parseInt(queryPage) : 1;
        const limit = 4;
        const startIndex = (Number(page) - 1) * limit;
        const sorting = "-postDate";
        const total = await Post.countDocuments({ _id: { $nin: [mongoose.Types.ObjectId(id)] }, category: { $in: categories.split(",") } });

        const query = await Post.find({ _id: { $nin: [mongoose.Types.ObjectId(id)] }, category: { $in: categories.split(",") } })
            .select("title images rating description price fields")
            .sort(sorting)
            .limit(limit)
            .skip(startIndex);

        const result = query.map((post) => {
            if (post.images) return { ...post._doc, postId: post._doc._id, previewImage: post.images[0], images: null };
            else return { ...post._doc, postId: post._doc._id, previewImage: null };
        });

        res.status(200).json({
            data: result,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
};

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id)
            .select("-raters")
            .populate({
                path: "reviews",
                strictPopulate: false,
                populate: {
                    path: "userId",
                    select: "name surname fullname image",
                },
            })
            .populate({
                path: "author",
                select: "companyName image phoneNumber telegram whatsapp",
            });
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json(error);
    }
};

export const getPostPreview = async (req, res) => {
    const { posts } = req.body;

    try {
        const postsResult = [];

        if (posts.length > 0) {
            for (let i = 0; i < posts.length; i++) {
                const post = await Post.findById(posts[i]).select("author title images rating description price fields");

                if (post.images) postsResult.push({ ...post._doc, postId: post._doc._id, previewImage: post.images[0], images: null });
                else postsResult.push({ ...post._doc, postId: post._doc._id, previewImage: null });
            }
        }

        res.status(200).json(postsResult);
    } catch (error) {
        res.status(404).json(error);
    }
};

export const createPost = async (req, res) => {
    const data = req.body;
    const post = new Post(data);

    try {
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(409).json(error);
    }
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that Id");

    const updatedPost = await Post.findByIdAndUpdate(id, { ...post, id }, { new: true });

    res.json(updatedPost);
};

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that Id");

    await Post.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully" });
};

export const favPost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: "Unauthenticated" });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that Id");

    const user = await User.findById(req.userId);

    const index = user.favorites.findIndex((postId) => String(postId) == String(id));

    if (index === -1) {
        user.favorites.push(id);
    } else {
        user.favorites = user.favorites.filter((postId) => String(postId) != String(id));
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, user, { new: true });

    res.json(updatedUser);
};

export const addReview = async (req, res) => {
    const { id } = req.params;
    const { rating, text } = req.body;
    if (!req.userId) return res.json({ message: "Unauthenticated" });

    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No post with that Id");
    }

    try {
        const post = await Post.findById(id).populate("reviews");

        const index = post.raters.findIndex((user) => String(user) == String(userId));

        if (index === -1) {
            const review = new Review({ rating: rating, text: text, postId: id, userId: userId });
            await review.save();
            post.reviews.push(review._id);
            post.raters.push(userId);

            let newRating = post.rating;
            newRating[review.rating]++;
            newRating.total++;
            newRating.avg = (5 * newRating[5] + 4 * newRating[4] + 3 * newRating[3] + 2 * newRating[2] + newRating[1]) / total;
            post.rating = newRating;

            const updatedPost = await Post.findByIdAndUpdate(post._id, post, { new: true }).populate({
                path: "reviews",
                strictPopulate: false,
                populate: {
                    path: "userId",
                    select: "name surname image",
                },
            });

            res.status(201).json(updatedPost);
        } else {
            res.status(201).json(post);
        }
    } catch (error) {
        console.log(error);
        res.status(409).json(error);
    }
};
