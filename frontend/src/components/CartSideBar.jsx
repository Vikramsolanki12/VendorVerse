import { useState, useEffect } from "react";
import { Trash2, Minus, Plus, ShoppingCart, X } from "lucide-react";

export default function CartSidebar({ cart = [], setCart = () => {}, onBuyNow }) {
  const [isOpen, setIsOpen] = useState(false);

  const updateQuantity = (index, delta) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = Math.max(
      1,
      (updatedCart[index].quantity || 1) + delta
    );
    setCart(updatedCart);
  };

  const handleRemove = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const total = cart.reduce(
    (acc, item) => acc + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  // Prevent body scroll when cart is open on mobile
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <>
      {/* Floating Cart Button (visible on all devices) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:ring-opacity-50 transition-colors"
        aria-label="Open cart"
      >
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {cart.length}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      {isOpen && (
        <aside
          className="fixed top-0 right-0 h-full w-full sm:max-w-sm lg:w-96 bg-white text-gray-900 z-50 shadow-xl flex flex-col transition-transform duration-300 ease-in-out"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
        >
          {/* Header */}
          <header className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-emerald-600">
              <ShoppingCart size={28} /> Cart
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Close cart"
            >
              <X size={24} />
            </button>
          </header>

          {/* Cart Items */}
          <main className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 mt-20">
                Your cart is currently empty.
              </p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item, idx) => (
                  <li
                    key={idx}
                    className="bg-white rounded-lg p-4 shadow-sm flex flex-col"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg truncate" title={item.name}>
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          ₹{item.price} / {item.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="ml-4 text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-4 flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => updateQuantity(idx, -1)}
                          disabled={(item.quantity || 1) <= 1}
                          className={`px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-l focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            (item.quantity || 1) <= 1 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="text"
                          readOnly
                          value={item.quantity || 1}
                          className="w-10 text-center font-semibold text-gray-900"
                        />
                        <button
                          onClick={() => updateQuantity(idx, 1)}
                          className="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-r focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </main>

          {/* Footer */}
          {cart.length > 0 && (
            <footer className="p-5 border-t border-gray-200 bg-white sticky bottom-0 z-10">
              <div className="flex justify-between items-center mb-4 font-semibold text-lg">
                <span>Total:</span>
                <span className="text-emerald-600">₹ {total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => onBuyNow?.()}
                className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:brightness-110 text-black font-bold py-3 rounded-lg shadow-md transition-colors"
              >
                🛍️ Buy Now
              </button>
            </footer>
          )}
        </aside>
      )}
    </>
  );
}
