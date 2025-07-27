import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export default function ProductForm({ storeId, onProductAdded }) {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    unit: "",
    stock: "",
    imageUrl: "",
  });

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = auth.currentUser;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProducts = async () => {
    if (!storeId || !user) return;
    const q = query(
      collection(db, "products"),
      where("storeId", "==", storeId),
      where("supplierId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, [storeId, user]);

  const resetForm = () => {
    setProduct({
      name: "",
      price: "",
      unit: "",
      stock: "",
      imageUrl: "",
    });
    setEditingId(null);
    setError("");
  };

  const handleAddOrUpdate = async () => {
    const { name, price, unit, stock, imageUrl } = product;
    if (!storeId) return setError("Store ID is missing.");
    if (!name || !price || !unit || !stock || !imageUrl) {
      return setError("All fields are required.");
    }

    setLoading(true);
    setError("");

    try {
      if (!user) throw new Error("You must be logged in.");
      if (editingId) {
        // Update product
        const ref = doc(db, "products", editingId);
        await updateDoc(ref, {
          name,
          price: Number(price),
          unit,
          stock: Number(stock),
          imageUrl,
        });
      } else {
        // Add product
        await addDoc(collection(db, "products"), {
          name,
          price: Number(price),
          unit,
          stock: Number(stock),
          imageUrl,
          storeId,
          supplierId: user.uid,
          createdAt: serverTimestamp(),
        });
      }

      resetForm();
      fetchProducts();
      onProductAdded?.();
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to save product.");
    }

    setLoading(false);
  };

  const handleEdit = (prod) => {
    setProduct({
      name: prod.name,
      price: prod.price,
      unit: prod.unit,
      stock: prod.stock,
      imageUrl: prod.imageUrl,
    });
    setEditingId(prod.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-emerald-700 mb-4">
        {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="p-2 border rounded bg-slate-50"
          value={product.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          className="p-2 border rounded bg-slate-50"
          value={product.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="unit"
          placeholder="Unit (e.g. kg, litre)"
          className="p-2 border rounded bg-slate-50"
          value={product.unit}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          className="p-2 border rounded bg-slate-50"
          value={product.stock}
          onChange={handleChange}
        />
        <input
          type="url"
          name="imageUrl"
          placeholder="Product Image URL"
          className="p-2 border rounded bg-slate-50 col-span-1 sm:col-span-2"
          value={product.imageUrl}
          onChange={handleChange}
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleAddOrUpdate}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded transition w-full sm:w-auto"
        >
          {loading ? "Saving..." : editingId ? "✅ Update Product" : "Add Product"}
        </button>
        {editingId && (
          <button
            onClick={resetForm}
            className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Existing Products */}
      <hr className="my-6" />
      <h3 className="text-lg font-semibold text-gray-700 mb-3">🗃️ Your Products</h3>
      {products.length === 0 ? (
        <p className="text-sm text-gray-500">No products yet.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((p) => (
            <li
              key={p.id}
              className="border rounded p-4 bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{p.price} / {p.unit} – {p.stock} in stock
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
