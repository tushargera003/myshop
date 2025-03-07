import { useState, useEffect } from "react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleAddProduct = () => {
    fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((addedProduct) => {
        setProducts([...products, addedProduct]);
        setNewProduct({ name: "", price: "", image: "" });
      });
  };

  const handleDelete = (id) => {
    fetch(`/api/admin/products/${id}`, { method: "DELETE" }).then(() =>
      setProducts(products.filter((product) => product._id !== id))
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Products</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 mr-2"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 mr-2"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Image URL"
          className="border p-2 mr-2"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
        />
        <button
          onClick={handleAddProduct}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="text-center border">
              <td className="border p-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-10 w-10 object-cover mx-auto"
                />
              </td>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">₹{product.price}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
