"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export const usePurchases = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPurchases = async (searchText = "") => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "https://www.ptltirumalatraders.online/api/purchases",
        {
          params: {
            search: searchText,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return {
    data,
    loading,
    search,
    setSearch,
    fetchPurchases,
  };
};