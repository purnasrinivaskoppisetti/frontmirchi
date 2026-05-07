import axios from "axios";

export const deletePurchase = async (
  id
) => {
  const token = localStorage.getItem("token");

  const res = await axios.delete(
    `https://www.ptltirumalatraders.online/api/purchases/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getPurchaseById = async (
  id
) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `https://www.ptltirumalatraders.online/api/purchases/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};