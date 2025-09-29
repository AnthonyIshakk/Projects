import { Button } from "@components/ui/button";
import { useNavigate } from "react-router";

export default function ProductsTable({ products, cols, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border">
        <div className="p-6 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!products?.length) {
    return <p className="text-center text-gray-500">No products found</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr className="text-gray-600">
            {cols.image && <th className="px-4 py-3 font-medium">Image</th>}
            {cols.title && <th className="px-4 py-3 font-medium">Title</th>}
            {cols.description && (
              <th className="px-4 py-3 font-medium">Description</th>
            )}
            {cols.price && <th className="px-4 py-3 font-medium">Price</th>}
            {cols.actions && <th className="px-4 py-3 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              {cols.image && (
                <td className="px-4 py-3">
                  <img
                    src={
                      p.image_url ||
                      "https://via.placeholder.com/80x60.png?text=No+Image"
                    }
                    alt={p.title || "Product"}
                    className="h-14 w-20 rounded-md border"
                  />
                </td>
              )}
              {cols.title && (
                <td className="px-4 py-3 font-medium">{p.title}</td>
              )}
              {cols.description && (
                <td className="px-4 py-3">
                  <div className="text-gray-600">{p.description}</div>
                </td>
              )}
              {cols.price && (
                <td className="px-4 py-3 font-semibold">
                  {p.price ? `$${p.price}` : "N/A"}
                </td>
              )}
              {cols.actions && (
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/products/${p.id}`)}
                  >
                    Edit
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
