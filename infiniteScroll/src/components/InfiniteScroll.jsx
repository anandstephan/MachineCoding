import { useCallback, useEffect, useRef, useState } from "react";

const InfiniteScroll = ({ renderListItem, getData, listData, query }) => {
  const pageNumber = useRef(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);
  const lastElementObserver = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        pageNumber.current += 1;
        fetchData();
      }
    });
    if (node) observer.current.observe(node);
  };
  const renderList = () => {
    return listData.map((item , idx) => {
      if (idx === listData.length - 1)
        return renderListItem(item, idx, lastElementObserver);
      return renderListItem(item, idx);
    });
  };

  const fetchData = () => {
    setLoading(true);
    getData(query, pageNumber.current)
      .catch((err) => console.log("Error", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [query]);
  return (
    <>
      {renderList()}
      {loading && "Loading"}
    </>
  );
};

export default InfiniteScroll;
