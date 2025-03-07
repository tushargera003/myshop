import { useEffect, useState } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    fetch("/api/admin/products", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleAddProduct = () => {
    fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts([...products, data]);
        setNewProduct({ name: "", price: "", image: "" });
      });
  };

  const handleDeleteProduct = (id) => {
    fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => setProducts(products.filter((p) => p._id !== id)));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
          className="border p-2 w-full"
        />
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Add Product
        </button>
      </div>

      {products.map((product) => (
        <div
          key={product._id}
          className="border p-4 mb-2 flex justify-between items-center"
        >
          <div>
            <p>
              <strong>{product.name}</strong> - ₹{product.price}
            </p>
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover mt-2"
            />
          </div>
          <button
            onClick={() => handleDeleteProduct(product._id)}
            className="bg-red-500 text-white px-4 py-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductManagement;
