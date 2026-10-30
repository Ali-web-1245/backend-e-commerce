import Product from "../models/Product.js";

const SORT_MAP = {
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1 },
  newest: { createdAt: -1 },
  "most-popular": { createdAt: 1 },
};

function buildFilter(q) {
  const filter = {};
  if (q.category) filter.category = new RegExp(q.category, "i");
  if (q.minPrice || q.maxPrice) {
    filter.price = {};
    if (q.minPrice) filter.price.$gte = Number(q.minPrice);
    if (q.maxPrice) filter.price.$lte = Number(q.maxPrice);
  }
  if (q.q) filter.title = new RegExp(q.q, "i");
  return filter;
}

export async function getProducts(req, res) {
  try {
    const filter = buildFilter(req.query);

    // exclude parameter (Related products: current product hide karne ke liye)
    if (req.query.exclude) {
      filter._id = { $ne: req.query.exclude };
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 100);
    const sort = SORT_MAP[req.query.sort] || { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      meta: { total, page, pages: Math.ceil(total / limit) },
      message: "Products fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, data: null, message: "Product not found" });
    }
    res.json({ success: true, data: product, message: "Product fetched successfully" });
  } catch (err) {
    const badId = err.name === "CastError";
    res.status(badId ? 400 : 500).json({
      success: false,
      data: null,
      message: badId ? "Invalid product id" : err.message,
    });
  }
}

export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product, message: "Product created" });
  } catch (err) {
    const validation = err.name === "ValidationError";
    res.status(validation ? 400 : 500).json({
      success: false,
      data: null,
      message: validation ? Object.values(err.errors).map(e => e.message).join(", ") : err.message,
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, data: null, message: "Product not found" });
    }
    res.json({ success: true, data: product, message: "Product updated" });
  } catch (err) {
    res.status(err.name === "ValidationError" ? 400 : 500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, data: null, message: "Product not found" });
    }
    res.json({ success: true, data: null, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
}
