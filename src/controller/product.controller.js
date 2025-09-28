import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    // Get page and limit from query params, set defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count of products
    const total = await Product.countDocuments({ isActive: true });

    // Get paginated products
    const products = await Product.find({ isActive: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts: total,
      productsPerPage: limit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, images, isActive } = req.body;

    const product = new Product({
      name,
      price,
      category,
      description,
      images, // Mảng các URL ảnh
      isActive,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments({ category, isActive: true });
    const totalPages = Math.ceil(total / limit);
    // Kiểm tra category hợp lệ
    const validCategories = [
      "Cà phê Việt Nam",
      "Cà phê pha máy",
      "Cold Brew",
      "Cà phê đá xay",
      "Trà",
      "Macchiato",
      "Thức uống trái cây",
      "Hi-tea Healthy",
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: "Danh mục không hợp lệ",
        validCategories,
      });
    }

    const products = await Product.find({ category, isActive: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts: total,
      productsPerPage: limit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const searchProductsByKeyword = async (req, res) => {
  try {
    const { keyword } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tạo query để tìm kiếm
    const query = {
      $or: [
        { category: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
      ],
      isActive: true,
    };

    // Đếm tổng số sản phẩm tìm được
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Tìm các sản phẩm có phân trang
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts: total,
      productsPerPage: limit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, isActive: true });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
