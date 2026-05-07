import axios from "axios";

export const addPayment = async (
  id,
  payload
) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `https://www.ptltirumalatraders.online/api/purchases/${id}/payment`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};