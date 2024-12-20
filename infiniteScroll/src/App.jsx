import { useCallback, useRef, useState } from "react";
import InfiniteScroll from "./components/InfiniteScroll";

const App = () => {
  const [query, setQuery] = useState("spy");
  const [data, setData] = useState([]);
  const controllerRef = useRef(null);
  const handleInput = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const renderItem = useCallback(({ title }, key, ref) => {
    return (
      <div key={key} ref={ref}>
        {title}
      </div>
    );
  }, []);

  const getData = useCallback(
    (query, pageNumber) => {
      return new Promise(async (resolve, reject) => {
        try {
          if (controllerRef.current) controllerRef.current.abort();
          controllerRef.current = new AbortController();
          controllerRef.current.signal.onabort = () => {
            console.log("Abort signal received!");
          };
          const promise = await fetch(
            "https://openlibrary.org/search.json?" +
              new URLSearchParams({
                q: query,
                page: pageNumber,
              }),
            { signal: controllerRef.current.signal }
          );
          const res = await promise.json();

          setData((prev) => [...prev, ...res.docs]);
          resolve(data);
        } catch (error) {
          reject();
        }
      });
    },
    [query]
  );
  return (
    <>
      <input type="text" onChange={handleInput} value={query} />
      <InfiniteScroll
        renderListItem={renderItem}
        getData={getData}
        listData={data}
        query={query}
      />
    </>
  );
};

export default App;
