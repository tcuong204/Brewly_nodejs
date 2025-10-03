import express from "express";
import otpService from "../service/otpService.js";

const router = express.Router();

// API gửi OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email là bắt buộc",
      });
    }

    const result = await otpService.sendOTP(email);
    res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// API verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email và OTP là bắt buộc",
      });
    }

    const result = await otpService.verifyOTP(email, otp);
    res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// API kiểm tra TTL
router.post("/otp-status", async (req, res) => {
  try {
    const { email } = req.body;
    const ttl = await otpService.getTTL(email);

    if (ttl === -2) {
      return res.json({
        success: false,
        message: "OTP không tồn tại",
      });
    }

    res.json({
      success: true,
      remainingSeconds: ttl,
      remainingMinutes: Math.floor(ttl / 60),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
