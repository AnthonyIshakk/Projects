import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ProductForm from "../components/ProductForm";

export default function ModifyProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch product");
      }

      const data = await res.json();
      setProduct(data);
    }
    fetchProduct();
  }, [id]);

  async function handleUpdate(updated) {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", updated.title);
    formData.append("description", updated.description);
    formData.append("price", updated.price);
    if (updated.image) {
      formData.append("image", updated.image);
    }

    const res = await fetch(`http://localhost:3000/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to update product");
      return;
    }

    alert("Product updated!");
    navigate("/cards");
  }

  async function handleDelete() {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to delete product");
      return;
    }

    alert("Product deleted!");
    navigate("/cards");
  }

  if (!product)
    return <p className="text-center text-gray-500">No product found</p>;

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white border rounded-xl shadow-sm p-8 w-full max-w-lg space-y-6">
        <h1 className="text-xl font-semibold">Edit Product</h1>
        <ProductForm
          product={product}
          mode="update"
          onSubmit={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
}
