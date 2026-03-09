import Product, { AGRICULTURE_CATEGORIES } from "../models/product.model.js";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import { generateSeo } from '../utils/seo.js';
import { invalidateCache } from '../middlewares/cache.js';

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

function escapeRegex(input = '') {
  return String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return parsed;
}

function normalizeSort(sort, hasSearch) {
  const sortKey = String(sort || '').trim();

  if (hasSearch && (!sortKey || sortKey === 'relevance')) {
    return { sortOption: { score: { $meta: 'textScore' } }, isRelevanceSearch: true };
  }

  if (sortKey === 'price_asc' || sortKey === 'regularPrice') {
    return { sortOption: { regularPrice: 1 }, isRelevanceSearch: false };
  }

  if (sortKey === 'price_desc' || sortKey === '-regularPrice') {
    return { sortOption: { regularPrice: -1 }, isRelevanceSearch: false };
  }

  if (sortKey === 'views') {
    return { sortOption: { views: -1 }, isRelevanceSearch: false };
  }

  if (sortKey === '-rating') {
    return { sortOption: { rating: -1, numReviews: -1 }, isRelevanceSearch: false };
  }

  if (sortKey === 'createdAt') {
    return { sortOption: { createdAt: 1 }, isRelevanceSearch: false };
  }

  // Support both explicit and legacy aliases for newest-first.
  if (!sortKey || sortKey === '-createdAt' || sortKey === 'newest') {
    return { sortOption: { createdAt: -1 }, isRelevanceSearch: false };
  }

  return { sortOption: { createdAt: -1 }, isRelevanceSearch: false };
}

// Agriculture-specific validation
function validateAgricultureDetails(category, subCategory, details) {
  const errors = [];
  if (category === 'Crops') {
    if (!details.cropType) errors.push('Crop type is required for crops');
    if (!details.quantity || details.quantity <= 0) errors.push('Quantity must be greater than 0');
    if (!details.unit) errors.push('Unit is required (kg, bags, tonnes, etc.)');
  }
  if (category === 'Livestock') {
    if (!details.animalType) errors.push('Animal type is required for livestock');
    if (!details.quantity || details.quantity <= 0) errors.push('Quantity must be greater than 0');
  }
  return errors;
}

// @desc    Create a product
export const createProduct = async (req, res, next) => {
  const uploadedImages = [];
  try {
    const payload = req.body || {};
    if ((!req.files || req.files.length < 1) && (!payload.imageUrls || payload.imageUrls.length < 1)) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }
    if (!payload.category || !AGRICULTURE_CATEGORIES[payload.category]) {
      return res.status(400).json({ message: 'Invalid or missing category.' });
    }

    const details = payload.details ? (typeof payload.details === 'string' ? JSON.parse(payload.details) : payload.details) : {};
    const detailErrors = validateAgricultureDetails(payload.category, payload.subCategory, details);
    if (detailErrors.length > 0) return res.status(400).json({ message: 'Invalid details', errors: detailErrors });

    const userRef = req.user?.user?.id || req.user?.id || payload.userRef;
    if (!userRef) return res.status(401).json({ message: 'Missing user reference.' });

    let imageUrls = payload.imageUrls || [];
    let imagePublicIds = payload.imagePublicIds || [];

    if (req.files && req.files.length > 0) {
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      const uploadPromises = req.files.map(async (file) => {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: 'Nguzza_products',
          transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto:good' }],
        });
        return { url: result.secure_url || result.url, public_id: result.public_id };
      });
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map(r => r.url);
      imagePublicIds = results.map(r => r.public_id);
      uploadedImages.push(...imagePublicIds);
    }

    let resolvedSellerEmail = payload.sellerEmail;
    let resolvedContactPhone = payload.contactPhone;
    if (!resolvedSellerEmail || !resolvedContactPhone) {
      const userDoc = await User.findById(userRef).lean();
      if (userDoc) {
        resolvedSellerEmail = resolvedSellerEmail || userDoc.email;
        resolvedContactPhone = resolvedContactPhone || userDoc.phoneNumber;
      }
    }

    const toCreate = {
      ...payload,
      details,
      imageUrls,
      imagePublicIds,
      userRef,
      sellerEmail: resolvedSellerEmail,
      contactPhone: resolvedContactPhone,
      moderationStatus: 'pending',
      status: 'active'
    };

    const product = await Product.create(toCreate);
    res.status(201).json({ success: true, product });
  } catch (error) {
    if (uploadedImages.length > 0) {
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      await Promise.all(uploadedImages.map(pid => cloudinary.uploader.destroy(pid).catch(() => { })));
    }
    next(error);
  }
};

// @desc    Upload product images (standalone, for two-step creation flow)
export const uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ success: false, message: 'No images provided.' });
    }

    const cloudinary = (await import('../utils/cloudinary.js')).default;
    const uploadPromises = req.files.map(async (file) => {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'Nguzza_products',
        transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto:good' }],
      });
      return { url: result.secure_url || result.url, public_id: result.public_id };
    });

    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map(r => r.url);
    const publicIds = results.map(r => r.public_id);

    res.status(200).json({
      success: true,
      imageUrls,
      publicIds,
      images: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
/**
 * @desc    Get products with advanced search and relevance ranking
 * @route   GET /api/products
 * @query   {String} keyword - Search keyword
 * @query   {String} search - Alternative search parameter (alias for keyword)
 * @query   {String} category - Product category
 * @query   {String} subCategory - Product subcategory
 * @query   {String} district - Location district
 * @query   {Number} minPrice - Minimum price
 * @query   {Number} maxPrice - Maximum price
 * @query   {String} sort - Sorting option: relevance, price_asc, price_desc, views, -createdAt, -rating
 * @query   {Number} pageNumber - Page number (default 1)
 * @query   {Number} pageSize - Items per page (default 12)
 * @query   {String} flashSaleOnly - Filter by flash sale (true/false)
 */
export const getProducts = async (req, res) => {
  try {
    const {
      category, subCategory, district, keyword, search,
      minPrice, maxPrice, sort, pageNumber = 1, pageSize = DEFAULT_PAGE_SIZE, flashSaleOnly
    } = req.query;

    const normalizedPage = parsePositiveInt(pageNumber, 1);
    const normalizedPageSize = Math.min(
      parsePositiveInt(pageSize, DEFAULT_PAGE_SIZE),
      MAX_PAGE_SIZE
    );
    const skip = normalizedPageSize * (normalizedPage - 1);
    const searchTerm = (keyword || search || '').trim();
    const hasSearch = searchTerm.length >= 2;

    const filter = { status: 'active', moderationStatus: 'approved' };
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (district) filter['location.district'] = district;

    const parsedMinPrice = parseNumber(minPrice);
    const parsedMaxPrice = parseNumber(maxPrice);
    if (parsedMinPrice !== null || parsedMaxPrice !== null) {
      filter.regularPrice = {};
      if (parsedMinPrice !== null) filter.regularPrice.$gte = parsedMinPrice;
      if (parsedMaxPrice !== null) filter.regularPrice.$lte = parsedMaxPrice;
    }

    if (flashSaleOnly === 'true') {
      filter.isFlashSale = true;
      filter.flashSaleEndsAt = { $gt: new Date() };
    }

    if (hasSearch) {
      const escapedQuery = escapeRegex(searchTerm);
      const substringRegex = new RegExp(escapedQuery, 'i');
      filter.$or = [
        { name: { $regex: substringRegex } },
        { category: { $regex: substringRegex } },
        { subCategory: { $regex: substringRegex } },
        { description: { $regex: substringRegex } }
      ];
    }

    let { sortOption, isRelevanceSearch } = normalizeSort(sort, hasSearch);

    // Default to newest first if relevance search is used without $text (regex fallback)
    if (isRelevanceSearch) {
      sortOption = { createdAt: -1 };
      isRelevanceSearch = false;
    }

    const pipeline = [
      { $match: filter },
      { $sort: sortOption },
      {
        $facet: {
          products: [{ $skip: skip }, { $limit: normalizedPageSize }],
          meta: [{ $count: 'total' }]
        }
      }
    ];

    const [result] = await Product.aggregate(pipeline);
    const products = result?.products || [];
    const count = result?.meta?.[0]?.total || 0;

    res.json({
      products,
      page: normalizedPage,
      pages: Math.ceil(count / normalizedPageSize),
      total: count,
      isRelevanceSearch
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.incrementViews();
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const isAdmin = Boolean(req.user?.user?.isAdmin);
    if (product.userRef.toString() !== (req.user?.user?.id || req.user?.id) && !isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const payload = { ...req.body };
    if (typeof payload.details === 'string') {
      payload.details = JSON.parse(payload.details);
    }

    if (Array.isArray(payload.imageUrls) && !Array.isArray(payload.imagePublicIds)) {
      payload.imagePublicIds = product.imagePublicIds || [];
    }

    if (!isAdmin) {
      payload.moderationStatus = 'pending';
      payload.status = 'active';
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, payload, { new: true });
    invalidateCache('/api/products');
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.userRef.toString() !== (req.user?.user?.id || req.user?.id) && !req.user?.user?.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Promotions & Tracking
export const promoteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const days = req.body?.days || 7;
    product.isFeatured = true;
    product.featuredUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trackContactClick = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.incrementContactClicks();
      res.json({ success: true });
    } else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

/**
 * @desc    Get search suggestions with partial keyword matching
 * @route   GET /api/products/suggestions
 * @query   {String} query - Search query for suggestions
 */
export const getSearchSuggestions = async (req, res) => {
  try {
    const rawQuery = (req.query.query || '').trim();
    if (rawQuery.length < 2) return res.json([]);

    const escapedQuery = escapeRegex(rawQuery);
    const substringRegex = new RegExp(escapedQuery, 'i');

    const products = await Product.find({
      status: 'active',
      moderationStatus: 'approved',
      $or: [
        { name: { $regex: substringRegex } },
        { category: { $regex: substringRegex } },
        { subCategory: { $regex: substringRegex } }
      ]
    })
      .select('name imageUrls category subCategory _id')
      .sort({ name: 1, _id: 1 })
      .limit(25)
      .lean();

    const seen = new Set();
    const suggestions = [];
    for (const product of products) {
      const dedupeKey = String(product.name || '').toLowerCase();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      suggestions.push(product);
      if (suggestions.length >= 10) break;
    }

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated products
export const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'active', moderationStatus: 'approved' })
      .sort({ rating: -1 })
      .limit(6);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ userRef: req.user?.user?.id });
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const reviewUserId = req.user?.user?.id || req.user?.id;

    // Check if the user is the owner of the product
    if (product.userRef.toString() === reviewUserId) {
      return res.status(400).json({ message: 'Owners cannot review their own products' });
    }

    const alreadyReviewed = await Review.findOne({ product: req.params.id, user: reviewUserId });
    if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });

    const reviewerDoc = await User.findById(reviewUserId).select('username').lean();
    const review = await Review.create({
      name: reviewerDoc?.username || 'Buyer',
      rating: Number(rating),
      comment,
      user: reviewUserId,
      product: req.params.id
    });

    const reviews = await Review.find({ product: req.params.id });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, i) => i.rating + acc, 0) / reviews.length;
    await product.save();

    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyToReview = async (req, res) => {
  try {
    const { comment } = req.body;
    const reviewId = req.params.reviewId;
    const userId = req.user?.user?._id || req.user?.user?.id || req.user?._id || req.user?.id;

    if (!userId) return res.status(401).json({ message: 'User reference missing from token' });

    const review = await Review.findById(reviewId).populate('product');
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (!review.product) return res.status(404).json({ message: 'Product associated with review not found' });

    // Check if the user is the owner of the product
    // Compare as strings to be safe
    const ownerId = review.product.userRef?.toString();
    const currentUserId = userId.toString();

    if (ownerId !== currentUserId) {
      return res.status(401).json({ message: 'Only the product owner can reply to reviews' });
    }

    review.replies.push({
      user: userId,
      comment,
      createdAt: new Date()
    });

    await review.save();

    // Fetch again to populate the newly added reply's user info
    const updatedReview = await Review.findById(reviewId)
      .populate('user', 'username avatar')
      .populate('replies.user', 'username avatar');

    res.status(200).json({ message: 'Reply added', review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'username avatar')
      .populate('replies.user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
