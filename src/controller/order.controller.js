import Order from "../models/order.model.js";
// ================= CREATE ORDER =================
export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      guestEmail,
      guestPhone,
      guestName,
      shippingAddress,
      items,
      totalAmount,
    } = req.body;

    // kiểm tra bắt buộc
    if (!shippingAddress || !items || items.length === 0) {
      return res.status(400).json({
        message: "Địa chỉ giao hàng và danh sách sản phẩm là bắt buộc",
      });
    }

    const newOrder = new Order({
      userId,
      guestEmail,
      guestPhone,
      guestName,
      shippingAddress,
      items,
      totalAmount,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi tạo đơn hàng",
      error: error.message,
    });
  }
};

// ================= GET ORDER BY ID =================
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate(
      "items.productId",
      "name price category"
    );

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi lấy đơn hàng",
      error: error.message,
    });
  }
};

// ================= GET ALL ORDERS =================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: Date.now() };

    console.log("Body nhận được:", req.body);
    console.log("UpdateData gửi đi:", updateData);

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json({
      message: "Cập nhật đơn hàng thành công",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi cập nhật đơn hàng",
      error: error.message,
    });
  }
};
