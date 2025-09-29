import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router";

export default function CreateProduct() {
  const navigate = useNavigate();

  async function handleCreate(product) {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    if (product.image) {
      formData.append("image", product.image);
    }

    const res = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to create product");
      return;
    }

    alert("Product created!");
    navigate("/cards");
  }

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white border rounded-xl shadow-sm p-8 w-full max-w-lg space-y-6">
        <h1 className="text-xl font-semibold">Create Product</h1>
        <ProductForm mode="create" onSubmit={handleCreate} />
      </div>
    </section>
  );
}
