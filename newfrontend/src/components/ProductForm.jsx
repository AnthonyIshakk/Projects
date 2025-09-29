import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { useState, useEffect } from "react";

export default function ProductForm({ product, mode, onSubmit, onDelete }) {
  const [title, setTitle] = useState(product ? product.title : "");
  const [description, setDescription] = useState(
    product ? product.description : ""
  );
  const [price, setPrice] = useState(product ? product.price : "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (product?.image_url) {
      setPreview(product.image_url);
    }
  }, [product]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ title, description, price, image });
  }

  let submitButton;
  let deleteButton;

  if (mode === "create") {
    submitButton = (
      <Button type="submit" className="w-full sm:w-auto">
        Create Product
      </Button>
    );
  } else if (mode === "update") {
    submitButton = (
      <Button type="submit" className="w-full sm:w-auto">
        Update Product
      </Button>
    );
    deleteButton = (
      <Button
        type="button"
        onClick={onDelete}
        variant="destructive"
        className="w-full sm:w-auto"
      >
        Delete Product
      </Button>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter product title"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            rows={4}
            className="border rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-gray-300"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="image">Product Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {preview && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          {submitButton}
          {deleteButton}
        </div>
      </form>
    </div>
  );
}
