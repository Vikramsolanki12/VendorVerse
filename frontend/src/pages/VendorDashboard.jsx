import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import CartSidebar from "../components/CartSideBar";
import SearchBar from "../components/SearchBar";
import BuyNow from "../components/BuyNow";  // <-- import BuyNow

export default function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showBuyNow, setShowBuyNow] = useState(false);  // <-- modal visibility state

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
      setFilteredProducts(items);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredProducts(products);
    } else {
      const results = products.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    }
  };

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // Calculate total dynamically with quantity (if your ProductCard or cart supports quantity)
  const total = cart.reduce(
    (acc, item) => acc + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  // Function to open BuyNow modal
  const handleBuyNow = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    setShowBuyNow(true);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-white via-slate-100 to-slate-200 text-slate-800 relative font-sans">
      {/* Main Content */}
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">
            Smart Marketplace for Vendors
          </h2>
          <p className="text-lg text-slate-600 mb-6">
            Search and add raw materials for your street food business – from veggies to spices.
          </p>

          <SearchBar onSearch={handleSearch} />

          {filteredProducts.length === 0 ? (
            <p className="text-red-500 text-lg mt-4">No products found.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Cart Sidebar for large screens */}
      <div className="hidden lg:block">
        <CartSidebar
          cart={cart}
          setCart={setCart}
          onBuyNow={handleBuyNow}  // Pass handler here
        />
      </div>

      {/* Floating Cart Button for small screens */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-5 right-5 lg:hidden bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-lg z-50"
      >
        🛒 Cart ({cart.length})
      </button>

      {/* Mobile Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center lg:hidden transition-opacity duration-300">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-sm shadow-2xl text-slate-800 relative">
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-3 right-4 text-slate-500 hover:text-slate-800 text-lg"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-600">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-slate-500 text-sm text-center">
                🛒 Your cart is empty.
              </p>
            ) : (
              <ul className="space-y-2 text-sm max-h-64 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <li
                    key={idx}
                    className="border border-slate-300 bg-slate-100 rounded p-2 text-slate-800 shadow-sm"
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-slate-500">
                      ₹{item.price} / {item.unit}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Add Buy Now button here for mobile */}
            {cart.length > 0 && (
              <button
                onClick={() => {
                  setShowCart(false);
                  handleBuyNow();
                }}
                className="mt-4 w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:brightness-110 text-black font-bold py-3 rounded-lg shadow-md"
              >
                🛍️ Buy Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Render BuyNow Modal */}
      {showBuyNow && (
        <BuyNow
          cart={cart}
          total={total}
          onClose={() => setShowBuyNow(false)}
        />
      )}
    </div>
  );
}
