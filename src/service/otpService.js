import redisClient from "../config/redis.js";
import transporter from "../config/email.js";

class OTPService {
  constructor() {
    this.OTP_PREFIX = "otp:";
    this.ATTEMPTS_PREFIX = "otp:attempts:";
    this.RATELIMIT_PREFIX = "otp:ratelimit:";
    this.OTP_EXPIRY = 300; // 5 phút
    this.MAX_ATTEMPTS = 3;
    this.MAX_REQUESTS = 3;
  }

  // Tạo OTP ngẫu nhiên
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Kiểm tra rate limit
  async checkRateLimit(email) {
    const key = this.RATELIMIT_PREFIX + email;
    const count = await redisClient.get(key);

    if (count && parseInt(count) >= this.MAX_REQUESTS) {
      const ttl = await redisClient.ttl(key);
      throw new Error(
        `Vượt quá giới hạn. Thử lại sau ${Math.ceil(ttl / 60)} phút`
      );
    }

    return true;
  }

  // Tăng rate limit counter
  async incrementRateLimit(email) {
    const key = this.RATELIMIT_PREFIX + email;
    const count = await redisClient.get(key);

    if (count) {
      await redisClient.incr(key);
    } else {
      await redisClient.setEx(key, this.OTP_EXPIRY, "1");
    }
  }

  // Lưu OTP vào Redis
  async saveOTP(email, otp) {
    const key = this.OTP_PREFIX + email;
    await redisClient.setEx(key, this.OTP_EXPIRY, otp);
    console.log(`✅ OTP saved: ${key} = ${otp} (TTL: ${this.OTP_EXPIRY}s)`);
  }

  // Lấy OTP từ Redis
  async getOTP(email) {
    const key = this.OTP_PREFIX + email;
    const otp = await redisClient.get(key);
    console.log(`🔍 Get OTP: ${key} = ${otp}`);
    return otp;
  }

  // Xóa OTP
  async deleteOTP(email) {
    const otpKey = this.OTP_PREFIX + email;
    const attemptsKey = this.ATTEMPTS_PREFIX + email;
    await redisClient.del([otpKey, attemptsKey]);
    console.log(`🗑️ Deleted OTP: ${otpKey}`);
  }

  // Kiểm tra số lần thử sai
  async checkAttempts(email) {
    const key = this.ATTEMPTS_PREFIX + email;
    const attempts = await redisClient.get(key);

    if (attempts && parseInt(attempts) >= this.MAX_ATTEMPTS) {
      throw new Error("Đã nhập sai OTP quá 3 lần. Vui lòng yêu cầu OTP mới");
    }
  }

  // Tăng số lần thử sai
  async incrementAttempts(email) {
    const key = this.ATTEMPTS_PREFIX + email;
    const attempts = await redisClient.get(key);

    if (attempts) {
      await redisClient.incr(key);
    } else {
      await redisClient.setEx(key, this.OTP_EXPIRY, "1");
    }
  }

  // Kiểm tra TTL còn lại
  async getTTL(email) {
    const key = this.OTP_PREFIX + email;
    const ttl = await redisClient.ttl(key);
    return ttl;
  }

  // Gửi OTP qua email
  async sendOTPEmail(email, otp) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔐 Mã OTP xác thực",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔐 Xác thực OTP</h1>
          </div>
          <div style="background: #f9f9f9; padding: 40px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">Mã OTP của bạn là:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h1 style="color: #667eea; letter-spacing: 10px; margin: 0; font-size: 42px; font-weight: bold;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">
              ⏱️ Mã này có hiệu lực trong <strong style="color: #d9534f;">5 phút</strong>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              ⚠️ Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to: ${email}`);
  }

  // Gửi OTP - Flow hoàn chỉnh
  async sendOTP(email) {
    // 1. Kiểm tra rate limit
    await this.checkRateLimit(email);

    // 2. Tạo OTP
    const otp = this.generateOTP();

    // 3. Lưu vào Redis
    await this.saveOTP(email, otp);

    // 4. Tăng rate limit
    await this.incrementRateLimit(email);

    // 5. Gửi email
    await this.sendOTPEmail(email, otp);

    return {
      success: true,
      message: "OTP đã được gửi đến email",
      expiresIn: this.OTP_EXPIRY,
    };
  }

  // Verify OTP - Flow hoàn chỉnh
  async verifyOTP(email, otp) {
    // 1. Kiểm tra số lần thử
    await this.checkAttempts(email);

    // 2. Lấy OTP từ Redis
    const storedOTP = await this.getOTP(email);

    // 3. Kiểm tra OTP có tồn tại
    if (!storedOTP) {
      throw new Error("OTP không tồn tại hoặc đã hết hạn");
    }

    // 4. So sánh OTP
    if (storedOTP !== otp) {
      await this.incrementAttempts(email);
      const key = this.ATTEMPTS_PREFIX + email;
      const attempts = await redisClient.get(key);
      throw new Error(`OTP không chính xác (${attempts}/${this.MAX_ATTEMPTS})`);
    }

    // 5. Xóa OTP sau khi verify thành công
    await this.deleteOTP(email);

    // 6. Xóa rate limit
    await redisClient.del(this.RATELIMIT_PREFIX + email);

    return {
      success: true,
      message: "Xác thực OTP thành công",
    };
  }
}

export default new OTPService();
