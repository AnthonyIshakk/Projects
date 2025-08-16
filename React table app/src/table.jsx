import { useState, useEffect } from "react";
import "./table.css";
import "./style.css";

const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 30;

  const fetchData = async ({ skip = 0, limit = 30, q = "" } = {}) => {
    setLoading(true);
    const urlParams = `limit=${limit}&skip=${skip}${
      sortConfig.key && sortConfig.direction
        ? `&sortBy=${sortConfig.key}&order=${
            sortConfig.direction === "ascending" ? "asc" : "desc"
          }`
        : ""
    }`;

    try {
      const url = q
        ? `https://dummyjson.com/products/search?q=${q}&` + urlParams
        : `https://dummyjson.com/products?` + urlParams;

      const res = await fetch(url);
      const result = await res.json();

      const items = result.products ?? [];
      setData(items);
      setTotal(result.total);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({ skip: page * limit, limit, q: searchTerm });
  }, [sortConfig, page]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = () => {
    setPage(0);
    fetchData({ skip: 0, limit, q: searchTerm });
  };

  const nextPage = () => {
    if ((page + 1) * limit < total) {
      const newPage = page + 1;
      setPage(newPage);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      const newPage = page - 1;
      setPage(newPage);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div>
        <h2>Product Table</h2>

        <div style={{ marginBottom: "10px" }}>
          <input
            className="search-bar"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div style={{ marginTop: "10px" }}>
          <button onClick={prevPage} disabled={page === 0}>
            Previous
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {page + 1} of {Math.ceil((total ?? 0) / limit)}
          </span>
          <button
            onClick={nextPage}
            disabled={(page + 1) * limit >= (total ?? 0)}
          >
            Next
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th
              onClick={() => requestSort("title")}
              style={{ cursor: "pointer" }}
            >
              Title{" "}
              {sortConfig.key === "title"
                ? sortConfig.direction === "ascending"
                  ? "🔼"
                  : "🔽"
                : ""}
            </th>
            <th
              onClick={() => requestSort("price")}
              style={{ cursor: "pointer" }}
            >
              Price{" "}
              {sortConfig.key === "price"
                ? sortConfig.direction === "ascending"
                  ? "🔼"
                  : "🔽"
                : ""}
            </th>
            <th
              onClick={() => requestSort("description")}
              style={{ cursor: "pointer" }}
            >
              Description{" "}
              {sortConfig.key === "description"
                ? sortConfig.direction === "ascending"
                  ? "🔼"
                  : "🔽"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.price}</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
