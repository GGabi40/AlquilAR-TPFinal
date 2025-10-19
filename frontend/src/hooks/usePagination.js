import { useState, useEffect } from "react";
import axios from "axios";

const usePagination = (endpoint, limit = 10) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const token = localStorage.getItem("token");

  const fetchData = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api${endpoint}`, {
        params: { page: pageNumber, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedData = res.data;

      if (fetchedData.length < limit) setHasMore(false);

      setData((prev) => [...prev, ...fetchedData]);
    } catch (err) {
      console.error("Error fetching data:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    fetchData(1);
  }, [endpoint]);

  const loadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  };

  return { data, loading, loadMore, hasMore };
};

export default usePagination;
