import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

export default function BuyNow({ product, onClose, onConfirm }) {
  // Guard to reset quantity if product changes or is undefined
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const total = product.price * quantity;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-2xl max-w-md w-full relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-red-400"
          aria-label="Close buy now modal"
        >
          <X size={22} />
        </button>

        {/* Product Info */}
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-sm text-gray-300 mb-4">
          Price: ₹<span className="text-emerald-400 font-semibold">{product.price}</span> / {product.unit}
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-6">
          <label className="text-sm text-slate-200">Quantity:</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="bg-slate-700 px-3 py-1 rounded hover:bg-slate-600"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="min-w-[32px] text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="bg-slate-700 px-3 py-1 rounded hover:bg-slate-600"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Total and Confirm */}
        <div className="flex flex-col items-center">
          <p className="text-lg font-medium mb-3">
            Total: <span className="text-emerald-400">₹{total}</span>
          </p>

          <button
            onClick={() => onConfirm({ ...product, quantity, total })}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:scale-105 transition"
          >
            <CheckCircle size={18} className="inline mr-2 mb-1" />
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
}
