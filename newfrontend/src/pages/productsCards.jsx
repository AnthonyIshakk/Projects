import { useState, useEffect } from "react";
import ProductsCards from "@/components/Product-cards";
import { useNavigate } from "react-router";
import { SearchIcon, Bell, Share2 } from "lucide-react";

export default function ProductsCardsPage() {
  const [limit, setLimit] = useState(8);
  const [userName, setUserName] = useState("");

  const [merchants, setMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const [state, setState] = useState({
    data: [],
    loading: true,
    page: 0,
    errorMessage: "",
    searchTerm: "",
    minPrice: "",
    maxPrice: "",
    view: "cards",
  });

  const {
    data,
    loading,
    page,
    errorMessage,
    searchTerm,
    minPrice,
    maxPrice,
    view,
  } = state;

  async function fetchProducts() {
    setState((s) => ({ ...s, loading: true }));

    try {
      const token = localStorage.getItem("token");

      //l choice tb3 l user men l dropdown
      let url = `http://localhost:3000/products`;
      if (selectedMerchant) {
        url += `?merchantId=${selectedMerchant}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        setState((s) => ({
          ...s,
          errorMessage: "Your session has expired! Please log in again!",
        }));
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch products");

      const result = await res.json();
      const items = result.products ?? [];

      setState((s) => ({
        ...s,
        data: items,
        errorMessage: "",
      }));
    } catch (error) {
      console.error("Error fetching data: ", error);
      setState((s) => ({
        ...s,
        errorMessage: error.message,
      }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }

  async function fetchUserProfile() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3000/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const result = await res.json();
        setUser(result.user);

        // eza l user admin we fetch the merchants l available as well
        if (!result.user.merchant_id) {
          const mRes = await fetch("http://localhost:3000/merchants", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const mData = await mRes.json();

          if (mRes.ok) {
            setMerchants(mData);
          } else {
            console.error("Failed to fetch merchants:", mData);
          }
        }

        const firstName = result.user?.name?.split(" ")[0] || "";
        setUserName(firstName);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user && !user.merchant_id) {
      fetchProducts();
    }
  }, [selectedMerchant]);

  const handleSearch = () => {
    setState((s) => ({ ...s, page: 0 }));
  };

  const filteredData = data.filter((item) => {
    const price = item.price || 0;
    const min = minPrice ? parseFloat(minPrice) : -Infinity;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = price >= min && price <= max;
    const matchesSearch =
      searchTerm.trim() === "" ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPrice && matchesSearch;
  });

  const start = page * limit;
  const paginatedData = filteredData.slice(start, start + limit);
  const totalFiltered = filteredData.length;

  const nextPage = () => {
    if ((page + 1) * limit < totalFiltered) {
      setState((s) => ({ ...s, page: s.page + 1 }));
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setState((s) => ({ ...s, page: s.page - 1 }));
    }
  };

  return (
    <section className="max-w-7xl mx-auto space-y-4">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="bg-white border rounded-md px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 px-2">
          {userName ? `Hello ${userName}` : "Hello..."}
        </h2>

        <div className="flex-1 max-w-3xl mx-6 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) =>
              setState((s) => ({ ...s, searchTerm: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full h-9 rounded-md bg-gray-100 border border-gray-200 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-700 focus:ring-1 focus:ring-gray-300 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <Bell className="w-5 h-5 text-gray-700" />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <Share2 className="w-5 h-5 text-gray-700" />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 overflow-hidden cursor-pointer bg-gray-100">
            <span className="text-sm font-semibold text-gray-700">
              {userName ? userName.charAt(0) : "?"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl px-6 py-6">
        <ProductsCards
          view={view}
          setView={(next) =>
            setState((s) => ({
              ...s,
              view: typeof next === "function" ? next(s.view) : next,
            }))
          }
          products={paginatedData}
          searchTerm={searchTerm}
          setSearchTerm={(val) => setState((s) => ({ ...s, searchTerm: val }))}
          onSearch={handleSearch}
          onCreate={() => navigate("/products/add")}
          page={page}
          total={totalFiltered}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          limit={limit}
          setLimit={setLimit}
          loading={loading}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setState={setState}
          merchants={merchants}
          selectedMerchant={selectedMerchant}
          setSelectedMerchant={setSelectedMerchant}
          user={user}
        />
      </div>
    </section>
  );
}
