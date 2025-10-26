import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});// find all products
        res.status(200).json({ products });
    } catch (error) {
        console.log("Error in getAllProducts Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featuredProducts"); // Try to get featured products from Redis cache
        if (featuredProducts) {
            return res.status(200).json({ products: JSON.parse(featuredProducts) }); // If found in cache, return it    // we have to parse it because while storing we have converted it into string
        }
        // If not found in cache, fetch from database
        //.lean() is used to convert Mongoose documents into plain JavaScript objects, which can improve performance and reduce memory usage when you don't need the full functionality of Mongoose documents.
        featuredProducts = await Product.find({ isFeatured: true }).lean(); // Fetch featured products from MongoDB

        // Ensure we always return an array (empty array if none found)
        if (!Array.isArray(featuredProducts)) {
            featuredProducts = [];
        }

        // Store the fetched featured products in Redis cache for future requests
        await redis.set("featuredProducts", JSON.stringify(featuredProducts)); // Cache for 1 hour (3600 seconds)

        // Return the featured products to the client
        return res.status(200).json({ products: featuredProducts });
    } catch (error) {
        console.log("Error in getFeaturedProducts Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}


export const createProduct = async (req, res) => {
    try {

        const { name, description, price, image, category } = req.body;

        // STEP 2: Log the destructured variables.
        console.log({ name, price, category, image });
        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }
        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {
                folder: 'products'
            });
            // STEP 3: Log the Cloudinary response to ensure it's successful.
            console.log("Cloudinary Response:", cloudinaryResponse);
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image: cloudinaryResponse ? cloudinaryResponse.secure_url : ""
        });
        res.status(201).json(product);

    } catch (error) {
        console.log("Error in createProduct Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Delete product  image from database of cloudinary
        if (product.image) {
            // Extract public ID from the image URL
            const publicId = product.image.split('/').pop().split('.')[0]; // Assuming the image URL is in the format: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/products/your-image.jpg
            try {

                await cloudinary.uploader.destroy(`products/${publicId}`); // Delete image from Cloudinary
                console.log("Image deleted from Cloudinary");
            } catch (error) {
                res.status(500).json({ message: "Failed to delete image from Cloudinary", error: error.message });
                console.log("Error deleting image from Cloudinary:", error.message);
            }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error in deleteProduct Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 4 } // Adjust the size as needed
            },
            {
                $project: {
                    name: 1,
                    price: 1,
                    description: 1,
                    image: 1,
                    category: 1
                }
            }
        ])
        res.status(200).json({ products });
    } catch (error) {

        console.log("Error in getRecommendedProducts Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getProductByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.status(200).json({ products });
    } catch (error) {
        console.log("Error in getProductByCategory Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

export const toggleFeaturedProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updateProduct = await product.save();
            // update the redis cache
            await updateFeaturedProductsCache();
            res.json(updateProduct);
        }
        else {

            res.status(404).json({ message: "Product not found" });
        }
    }
    catch (error) {
        console.log("Error in toggleFeaturedProduct Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean(); // lean are used to convert mongoose document into plain javascript object
        await redis.set("featuredProducts", JSON.stringify(featuredProducts));// it store in key value pair // we have to convert it into string because redis only store string
    } catch (error) {
        console.log("Error in updateFeaturedProductsCache", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}


