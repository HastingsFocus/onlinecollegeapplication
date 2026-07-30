import axios from "axios";

const payChangu = axios.create({
  baseURL: "https://api.paychangu.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
  },
});

// ==============================
// Get Supported Operators
// ==============================
export const getSupportedOperators = async () => {
  try {
    const { data } = await payChangu.get("/mobile-money/");

    return data;
  } catch (error) {
    console.error("GET OPERATORS ERROR:");
    console.error(error.response?.data || error.message);

    throw new Error(
      error.response?.data?.message ||
      "Failed to retrieve supported operators."
    );
  }
};

// ==============================
// Initiate Mobile Money Payment
// ==============================
export const initiatePayment = async ({
  chargeId,
  operatorRefId,
  phoneNumber,
  amount,
  email,
  firstName,
  lastName,
}) => {
  try {
    const payload = {
      mobile: phoneNumber,
      mobile_money_operator_ref_id: operatorRefId,
      amount: Number(amount),
      charge_id: chargeId,
      email,
      first_name: firstName,
      last_name: lastName,
    };

    console.log("=================================");
    console.log("PAYCHANGU PAYMENT REQUEST");
    console.log(JSON.stringify(payload, null, 2));
    console.log("=================================");

    const { data } = await payChangu.post(
      "/mobile-money/payments/initialize",
      payload
    );

    console.log("=================================");
    console.log("PAYCHANGU PAYMENT RESPONSE");
    console.log(JSON.stringify(data, null, 2));
    console.log("=================================");

    return data;
  } catch (error) {
    console.log("=================================");
    console.log("PAYCHANGU PAYMENT ERROR");
    console.log(error.response?.status);
    console.log(JSON.stringify(error.response?.data, null, 2));
    console.log("=================================");

    throw new Error(
      error.response?.data?.message ||
      "Unable to initiate payment."
    );
  }
};

// ==============================
// Verify Payment
// ==============================
export const verifyPayment = async (chargeId) => {
  try {
    const { data } = await payChangu.get(
      `/mobile-money/payments/${chargeId}/verify`
    );

    return data;
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:");
    console.error(error.response?.data || error.message);

    throw new Error(
      error.response?.data?.message ||
      "Failed to verify payment."
    );
  }
};

// ==============================
// Get Payment Details
// ==============================
export const getChargeDetails = async (chargeId) => {
  try {
    const { data } = await payChangu.get(
      `/mobile-money/payments/${chargeId}/details`
    );

    return data;
  } catch (error) {
    console.error("PAYMENT DETAILS ERROR:");
    console.error(error.response?.data || error.message);

    throw new Error(
      error.response?.data?.message ||
      "Unable to retrieve payment details."
    );
  }
};