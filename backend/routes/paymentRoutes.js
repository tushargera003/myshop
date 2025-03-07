import express from "express";
import paytmChecksum from "paytmchecksum";

const router = express.Router();

// Initialize Payment
router.post("/pay", async (req, res) => {
  try {
    const { amount, email } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) ){
      return res.status(400).json({ error: "Invalid amount" });
    }

    const orderId = `ORDER_${new Date().getTime()}`;

    const paytmParams = {
      MID: process.env.PAYTM_MERCHANT_ID,
      WEBSITE: "WEBSTAGING",
      INDUSTRY_TYPE_ID: "Retail",
      CHANNEL_ID: "WEB",
      ORDER_ID: orderId,
      CUST_ID: email,
      TXN_AMOUNT: amount.toString(),
      CALLBACK_URL: "http://localhost:5000/api/payment/callback",
      EMAIL: email,
    };

    const checksum = await paytmChecksum.generateSignature(
      paytmParams,
      process.env.PAYTM_MERCHANT_KEY
    );

    paytmParams.CHECKSUMHASH = checksum;

    res.json({ paytmParams });
  } catch (error) {
    console.error("Payment initialization error:", error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

// Payment Callback
router.post("/callback", async (req, res) => {
  const paytmResponse = req.body;
  const paytmChecksum = paytmResponse.CHECKSUMHASH;
  delete paytmResponse.CHECKSUMHASH;

  try {
    const isVerifySignature = paytmChecksum.verifySignature(
      paytmResponse,
      process.env.PAYTM_MERCHANT_KEY,
      paytmChecksum
    );

    if (!isVerifySignature) {
      return res.status(400).json({ error: "Checksum verification failed" });
    }

    if (paytmResponse.STATUS === "TXN_SUCCESS") {
      res.redirect(`http://localhost:5173/payment-success?orderId=${paytmResponse.ORDERID}`,{ state: { fromPayment: true }});
    } else {
      res.redirect("http://localhost:5173/payment-failed",{ state: { fromPayment: true } });
    }
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ error: "Callback processing failed" });
  }
});

export default router;