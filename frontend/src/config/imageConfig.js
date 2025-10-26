import { CATEGORIES } from './categoryConfig';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dahpi68b7'; // Your cloud name from .env

// Base URL for Cloudinary images
const CLOUDINARY_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Image quality and format optimization parameters
const IMAGE_PARAMS = {
    hero: 'c_scale,w_1920,q_auto,f_auto',
    slideshow: 'c_scale,w_1600,q_auto,f_auto',
    category: 'c_scale,w_400,q_auto,f_auto'
};

// Image URLs
export const IMAGES = {
    // Hero section image
    hero: `${CLOUDINARY_URL}/${IMAGE_PARAMS.hero}/hero/hero.jpg`,


    // Slideshow images
    slideshow: [
        `${CLOUDINARY_URL}/${IMAGE_PARAMS.slideshow}/slide/slide1`,
        `${CLOUDINARY_URL}/${IMAGE_PARAMS.slideshow}/slide/slide2`,
        `${CLOUDINARY_URL}/${IMAGE_PARAMS.slideshow}/slide/slide3`,
    ],

    // Category images
    categories: Object.fromEntries(
        CATEGORIES.map(category => [
            category.imageKey,
            `${CLOUDINARY_URL}/${IMAGE_PARAMS.category}/categories/${category.imageKey}`
        ])
    )
};