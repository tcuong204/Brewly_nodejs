Ok 👍 mình sẽ ghi full file **`order.md`** ngay tại đây, bạn chỉ cần copy về là dùng được.

---

# `order.md`

````markdown
# Order Module - Guest Checkout with Email Verification

## 1. Mục đích

- Hỗ trợ khách hàng đặt đồ uống mà không cần đăng nhập.
- Xác thực đơn hàng qua **email** để đảm bảo tính hợp lệ.
- Khách có thể tra cứu/tracking đơn hàng bằng **email + orderCode**.

---

## 2. Cấu trúc Collection: `orders`

```json
{
  "_id": ObjectId,
  "orderCode": String,          // Mã đơn hàng duy nhất, VD: "DH20250929001"
  "guestEmail": String,         // Email khách hàng (bắt buộc)
  "guestName": String,          // Tên khách hàng
  "guestPhone": String,         // SĐT khách hàng
  "shippingAddress": String,    // Địa chỉ giao hàng
  "verifyCode": String,         // Mã OTP gửi qua email
  "isVerified": Boolean,        // Đơn đã xác thực email chưa
  "status": String,             // pending | processing | shipping | completed | cancelled
  "amount": Number,             // Tổng tiền
  "paymentStatus": String,      // unpaid | paid | failed | refunded
  "createdAt": Date,            // Ngày tạo đơn
  "updatedAt": Date             // Ngày cập nhật đơn
}
```
````

---

## 3. Luồng xử lý Guest Checkout

### Bước 1: Khách đặt đơn

- Nhập: **tên, email, số điện thoại, địa chỉ, giỏ hàng**.
- Backend sinh: `orderCode` + `verifyCode` (OTP).
- Lưu vào DB với `isVerified = false`.

### Bước 2: Gửi email xác thực

- Nội dung:

  ```
  Cảm ơn bạn đã đặt hàng tại MyDrink!
  Mã xác thực đơn hàng của bạn là: 123456
  Hoặc click link: https://mydrink.vn/verify?order=DH20250929001&code=123456
  ```

- `verifyCode` có hiệu lực 5–10 phút.

### Bước 3: Khách xác thực đơn hàng

- Nhập `orderCode` + `verifyCode` hoặc click link.
- Backend kiểm tra:

  - Nếu đúng → update `isVerified = true`.
  - Nếu sai hoặc hết hạn → báo lỗi.

### Bước 4: Theo dõi đơn hàng

- Khách dùng **email + orderCode** để xem trạng thái đơn (`pending → processing → shipping → completed`).

---

## 4. API Gợi ý

### `POST /api/orders`

- Tạo đơn hàng mới (guest checkout).
- Body:

  ```json
  {
    "guestName": "Nguyễn Văn A",
    "guestEmail": "nguyenvana@gmail.com",
    "guestPhone": "0912345678",
    "shippingAddress": "123 Lê Lợi, Hà Nội",
    "cart": [
      { "productId": "65123...", "quantity": 2 },
      { "productId": "65145...", "quantity": 1 }
    ]
  }
  ```

### `POST /api/orders/verify`

- Xác thực đơn hàng qua email OTP.
- Body:

  ```json
  {
    "orderCode": "DH20250929001",
    "verifyCode": "123456"
  }
  ```

### `GET /api/orders/:orderCode?email=...`

- Tra cứu đơn hàng theo `orderCode + email`.
- Response: thông tin đơn hàng + trạng thái.

---

## 5. Ghi chú

- **verifyCode** nên được hash trong DB (giống như password).
- **orderCode** nên sinh theo format: `DHYYYYMMDDxxx` (ví dụ: `DH20250929001`).
- Nếu sau X phút khách không xác thực → đơn hàng có thể bị hủy tự động.

```

---

👉 Bạn có muốn mình viết tiếp phần **Mongoose Schema + Nodemailer code gửi OTP** để agent backend triển khai ngay không?
```
