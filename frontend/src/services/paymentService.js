import api from "../api/axios";

export const initiatePayment = async (paymentData) => {
  const { data } = await api.post(
    "/payments/initiate",
    paymentData
  );

  return data;
};

export const getPaymentStatus = async (applicationId) => {
  const { data } = await api.get(
    `/payments/status/${applicationId}`
  );

  return data;
};

export const getMyPayments = async () => {
  const { data } = await api.get(
    "/payments/my-payments"
  );

  return data;
};

export const getAllPayments = async () => {
  const { data } = await api.get(
    "/payments"
  );

  return data;
};