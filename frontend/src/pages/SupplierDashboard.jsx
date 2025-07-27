import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
import StoreForm from "../supplier/StoreForm";
import SupplierForm from "../supplier/SupplierForm";
import ProductForm from "../supplier/ProductForm";

export default function SupplierDashboard() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [store, setStore] = useState(null);
  const [supplierProfile, setSupplierProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 Listen for auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔄 Check store & profile
  useEffect(() => {
    if (user) checkStoreAndSupplier();
  }, [user]);

  const checkStoreAndSupplier = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Fetch Store
      const storeQuery = query(
        collection(db, "stores"),
        where("supplierId", "==", user.uid)
      );
      const storeSnap = await getDocs(storeQuery);

      if (!storeSnap.empty) {
        const storeData = {
          id: storeSnap.docs[0].id,
          ...storeSnap.docs[0].data(),
        };
        setStore(storeData);

        // 2. Fetch Supplier Profile
        const supplierDocRef = doc(db, "suppliers", user.uid);
        const supplierSnap = await getDoc(supplierDocRef);

        if (supplierSnap.exists()) {
          setSupplierProfile(supplierSnap.data());

          // 3. Fetch Products
          const productQuery = query(
            collection(db, "products"),
            where("storeId", "==", storeData.id)
          );
          const productSnap = await getDocs(productQuery);
          const productList = productSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(productList);
        }
      } else {
        setStore(null);
        setSupplierProfile(null);
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    }

    setLoading(false);
  };

  // 🔒 Route protection
  if (authLoading) return <p className="text-center mt-10">Checking authentication...</p>;
  if (!user) return <Navigate to="/supplier-login" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-slate-200">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-slate-800">Supplier Dashboard</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Store Creation */}
        {!store && <StoreForm onStoreCreated={checkStoreAndSupplier} />}

        {/* Supplier Profile Setup */}
        {store && !supplierProfile && (
          <SupplierForm onSupplierCreated={checkStoreAndSupplier} />
        )}

        {/* Product Management */}
        {store && supplierProfile && (
          <>
            <p className="mb-4 text-lg text-emerald-700">
              Store: <strong>{store.name}</strong>
            </p>

            {/* ✅ Product Form */}
            <ProductForm
              storeId={store.id}
              supplierId={user.uid}
              onProductAdded={checkStoreAndSupplier}
            />

            {/* 🛍️ Product List */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4 text-slate-700">
                Your Products
              </h2>

              {loading ? (
                <p className="text-slate-500">Loading...</p>
              ) : products.length === 0 ? (
                <p className="text-slate-500">No products listed yet.</p>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <li
                      key={product.id}
                      className="border border-slate-300 bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2"
                    >
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded"
                        />
                      )}
                      <h3 className="text-lg font-semibold text-emerald-700">{product.name}</h3>
                      <p className="text-sm text-slate-600">
                        ₹{product.price} / {product.unit}
                      </p>
                      <p className="text-sm text-slate-500">Stock: {product.stock}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
